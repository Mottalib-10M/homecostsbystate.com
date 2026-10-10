#!/usr/bin/env python3
"""
Rejouable : reconstruit les jeux de données de src/data/ à partir des fichiers officiels (RECETTE §4).

    python3 scripts/build-data.py            # lit .cache-raw/ (téléchargé au besoin)

Sources (toutes publiques, aucune clé) :
  - BLS OEWS mai 2025 : salaires par métier et par État (oesm25st.zip, oesm25nat.zip)
  - Census, Economic Census 2022, construction (EC2223BASIC) et transport (EC2248BASIC) : parts des coûts
  - Census/HUD, American Housing Survey 2023, PUF national v1.1 (project.csv, household.csv) : coûts déclarés
  - BLS CPI-U (CUUR0000SA0) : mise en dollars d'août 2026
  - EIA : électricité (Electric Power Monthly 5.6.B, EIA-861 table 5A), gaz naturel, propane, fioul
  - NYSERDA (data.ny.gov 3x8r-34rs) : dispersion des prix solaires résidentiels déclarés en 2025
  - NLR (ex-NREL) PVWatts v8 : production annuelle d'un kW par État (pvwatts/*.json)
Les fichiers bruts restent hors dépôt (.cache-raw/, .gitignore) ; seuls les JSON compacts sont versionnés.
"""
import csv, json, math, os, re, sys, urllib.request
import numpy as np
import pandas as pd

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RAW = os.path.join(ROOT, '.cache-raw')
OUT = os.path.join(ROOT, 'src', 'data')
UA = 'Mozilla/5.0 (research; contact@us-home-costs.example)'
os.makedirs(RAW, exist_ok=True)

DOWNLOADS = {
    'oesm25st.zip': 'https://www.bls.gov/oes/special-requests/oesm25st.zip',
    'oesm25nat.zip': 'https://www.bls.gov/oes/special-requests/oesm25nat.zip',
    'EC2223BASIC.zip': 'https://www2.census.gov/programs-surveys/economic-census/data/2022/sector23/EC2223BASIC.zip',
    'EC2248BASIC.zip': 'https://www2.census.gov/programs-surveys/economic-census/data/2022/sector48/EC2248BASIC.zip',
    'ahs2023.zip': 'https://www2.census.gov/programs-surveys/ahs/2023/AHS%202023%20National%20PUF%20v1.1%20CSV.zip',
    'table_5_06_b.xlsx': 'https://www.eia.gov/electricity/monthly/xls/table_5_06_b.xlsx',
    'table_5A.xlsx': 'https://www.eia.gov/electricity/sales_revenue_price/xls/table_5A.xlsx',
    'NG_PRI_SUM_A_EPG0_PRS_DMCF_M.xls': 'https://www.eia.gov/dnav/ng/xls/NG_PRI_SUM_A_EPG0_PRS_DMCF_M.xls',
    'PET_PRI_WFR_A_EPLLPA_PRS_DPGAL_W.xls': 'https://www.eia.gov/dnav/pet/xls/PET_PRI_WFR_A_EPLLPA_PRS_DPGAL_W.xls',
    'PET_PRI_WFR_A_EPD2F_PRS_DPGAL_W.xls': 'https://www.eia.gov/dnav/pet/xls/PET_PRI_WFR_A_EPD2F_PRS_DPGAL_W.xls',
    'PET_PRI_GND_DCUS_NUS_W.xls': 'https://www.eia.gov/dnav/pet/xls/PET_PRI_GND_DCUS_NUS_W.xls',
    'recs2020_ce4.6.xlsx': 'https://www.eia.gov/consumption/residential/data/2020/c&e/xls/ce4.6.xlsx',
}


def raw(name):
    p = os.path.join(RAW, name)
    if os.path.exists(p):
        return p
    # Les fichiers dézippés portent un autre nom : on télécharge l'archive et on l'extrait.
    for z, url in DOWNLOADS.items():
        if z == name or (z.endswith('.zip') and name in ZIP_MEMBERS.get(z, [])):
            zp = os.path.join(RAW, z)
            if not os.path.exists(zp):
                req = urllib.request.Request(url, headers={'User-Agent': UA})
                open(zp, 'wb').write(urllib.request.urlopen(req, timeout=300).read())
            if z.endswith('.zip'):
                import zipfile
                with zipfile.ZipFile(zp) as zf:
                    for m in zf.namelist():
                        if m.split('/')[-1] == name:
                            open(p, 'wb').write(zf.read(m))
            return p
    sys.exit(f'missing raw file {name}')


ZIP_MEMBERS = {
    'oesm25st.zip': ['state_M2025_dl.xlsx'], 'oesm25nat.zip': ['national_M2025_dl.xlsx'],
    'EC2223BASIC.zip': ['EC2223BASIC.dat'], 'EC2248BASIC.zip': ['EC2248BASIC.dat'],
    'ahs2023.zip': ['project.csv', 'household.csv'],
}

# ---------------------------------------------------------------- États (Census regions and divisions)
STATES = [
    ('AL', 'Alabama', '01', 6), ('AK', 'Alaska', '02', 9), ('AZ', 'Arizona', '04', 8), ('AR', 'Arkansas', '05', 7),
    ('CA', 'California', '06', 9), ('CO', 'Colorado', '08', 8), ('CT', 'Connecticut', '09', 1), ('DE', 'Delaware', '10', 5),
    ('DC', 'District of Columbia', '11', 5), ('FL', 'Florida', '12', 5), ('GA', 'Georgia', '13', 5), ('HI', 'Hawaii', '15', 9),
    ('ID', 'Idaho', '16', 8), ('IL', 'Illinois', '17', 3), ('IN', 'Indiana', '18', 3), ('IA', 'Iowa', '19', 4),
    ('KS', 'Kansas', '20', 4), ('KY', 'Kentucky', '21', 6), ('LA', 'Louisiana', '22', 7), ('ME', 'Maine', '23', 1),
    ('MD', 'Maryland', '24', 5), ('MA', 'Massachusetts', '25', 1), ('MI', 'Michigan', '26', 3), ('MN', 'Minnesota', '27', 4),
    ('MS', 'Mississippi', '28', 6), ('MO', 'Missouri', '29', 4), ('MT', 'Montana', '30', 8), ('NE', 'Nebraska', '31', 4),
    ('NV', 'Nevada', '32', 8), ('NH', 'New Hampshire', '33', 1), ('NJ', 'New Jersey', '34', 2), ('NM', 'New Mexico', '35', 8),
    ('NY', 'New York', '36', 2), ('NC', 'North Carolina', '37', 5), ('ND', 'North Dakota', '38', 4), ('OH', 'Ohio', '39', 3),
    ('OK', 'Oklahoma', '40', 7), ('OR', 'Oregon', '41', 9), ('PA', 'Pennsylvania', '42', 2), ('RI', 'Rhode Island', '44', 1),
    ('SC', 'South Carolina', '45', 5), ('SD', 'South Dakota', '46', 4), ('TN', 'Tennessee', '47', 6), ('TX', 'Texas', '48', 7),
    ('UT', 'Utah', '49', 8), ('VT', 'Vermont', '50', 1), ('VA', 'Virginia', '51', 5), ('WA', 'Washington', '53', 9),
    ('WV', 'West Virginia', '54', 5), ('WI', 'Wisconsin', '55', 3), ('WY', 'Wyoming', '56', 8),
]
DIVISIONS = {1: 'New England', 2: 'Middle Atlantic', 3: 'East North Central', 4: 'West North Central', 5: 'South Atlantic',
             6: 'East South Central', 7: 'West South Central', 8: 'Mountain', 9: 'Pacific'}
slug = lambda n: n.lower().replace(' ', '-')

# ---------------------------------------------------------------- Métiers OEWS
OCC = {
    'roofers': ('47-2181', 'Roofers'),
    'plumbers': ('47-2152', 'Plumbers, pipefitters and steamfitters'),
    'hvac': ('49-9021', 'Heating, air conditioning and refrigeration mechanics and installers'),
    'electricians': ('47-2111', 'Electricians'),
    'painters': ('47-2141', 'Painters, construction and maintenance'),
    'drywall': ('47-2081', 'Drywall and ceiling tile installers'),
    'cement': ('47-2051', 'Cement masons and concrete finishers'),
    'laborers': ('47-2061', 'Construction laborers'),
    'carpenters': ('47-2031', 'Carpenters'),
    'fence': ('47-4031', 'Fence erectors'),
    'solar': ('47-2231', 'Solar photovoltaic installers'),
    'landscaping': ('37-3011', 'Landscaping and groundskeeping workers'),
    'movers': ('53-7062', 'Laborers and freight, stock, and material movers, hand'),
}


def num(v):
    try:
        x = float(str(v).replace(',', ''))
        return None if math.isnan(x) else round(x, 2)
    except (ValueError, TypeError):
        return None  # '*' (non publié), '#' (≥ 115 $/h), '**'


def wages():
    st = pd.read_excel(raw('state_M2025_dl.xlsx'), dtype=str)
    na = pd.read_excel(raw('national_M2025_dl.xlsx'), dtype=str)
    codes = {v[0]: k for k, v in OCC.items()}
    nat = {}
    for _, r in na[(na.OCC_CODE.isin(codes)) & (na.O_GROUP == 'detailed')].iterrows():
        nat[codes[r.OCC_CODE]] = {'mean': num(r.H_MEAN), 'p25': num(r.H_PCT25), 'median': num(r.H_MEDIAN), 'p75': num(r.H_PCT75), 'emp': num(r.TOT_EMP)}
    out = {}
    for ab, name, _, _ in STATES:
        rows = st[(st.PRIM_STATE == ab) & (st.OCC_CODE.isin(codes)) & (st.AREA_TYPE == '2')]
        d = {}
        for _, r in rows.iterrows():
            rec = {'mean': num(r.H_MEAN), 'p25': num(r.H_PCT25), 'median': num(r.H_MEDIAN), 'p75': num(r.H_PCT75), 'emp': num(r.TOT_EMP), 'lq': num(r.LOC_QUOTIENT)}
            if rec['mean'] is not None:
                d[codes[r.OCC_CODE]] = rec
        out[slug(name)] = d
    return {'reference': 'May 2025', 'released': '2026-05-15', 'occupations': {k: {'soc': v[0], 'title': v[1]} for k, v in OCC.items()}, 'national': nat, 'states': out}


# ---------------------------------------------------------------- Economic Census 2022
NAICS = {
    '238160': 'Roofing contractors', '238220': 'Plumbing, heating, and air-conditioning contractors', '238210': 'Electrical contractors and other wiring installation contractors',
    '238320': 'Painting and wall covering contractors', '238310': 'Drywall and insulation contractors', '238110': 'Poured concrete foundation and structure contractors',
    '238130': 'Framing contractors', '238990': 'All other specialty trade contractors', '236118': 'Residential remodelers',
}


def shares():
    out = {}
    with open(raw('EC2223BASIC.dat'), errors='ignore') as f:
        r = csv.DictReader(f, delimiter='|')
        r.fieldnames[0] = 'GEOTYPE'
        for x in r:
            if x['GEOTYPE'] == '01' and x['NAICS2022'] in NAICS:
                g = lambda k: float(x[k] or 0)
                work = g('RCPCWRK')
                out[x['NAICS2022']] = {
                    'label': x['NAICS2022_LABEL'], 'valueOfWorkK': work,
                    'materials': round(g('CSTMPRT') / work, 4), 'payroll': round(g('PAYANN') / work, 4),
                    'benefits': round(g('BENEFIT') / work, 4), 'subcontracted': round(g('CSTSCNT') / work, 4),
                }
    with open(raw('EC2248BASIC.dat'), errors='ignore') as f:
        r = csv.DictReader(f, delimiter='|')
        r.fieldnames[0] = 'GEOTYPE'
        for x in r:
            if x['GEOTYPE'] == '01' and x['NAICS2022'] == '484210':
                out['484210'] = {'label': x['NAICS2022_LABEL'], 'revenueK': float(x['RCPTOT']), 'payrollK': float(x['PAYANN']),
                                 'revenuePerPayrollDollar': round(float(x['RCPTOT']) / float(x['PAYANN']), 3)}
    return out


# ---------------------------------------------------------------- CPI-U
def cpi():
    p = raw('cpi.json') if os.path.exists(os.path.join(RAW, 'cpi.json')) else None
    if not p:
        body = json.dumps({'seriesid': ['CUUR0000SA0'], 'startyear': '2021', 'endyear': '2026', 'annualaverage': True}).encode()
        req = urllib.request.Request('https://api.bls.gov/publicAPI/v1/timeseries/data/', data=body, headers={'Content-Type': 'application/json', 'User-Agent': UA})
        p = os.path.join(RAW, 'cpi.json'); open(p, 'wb').write(urllib.request.urlopen(req).read())
    d = json.load(open(p))['Results']['series'][0]['data']
    annual = {int(x['year']): float(x['value']) for x in d if x['period'] == 'M13'}
    monthly = sorted([(int(x['year']), int(x['period'][1:]), float(x['value'])) for x in d if x['period'] != 'M13' and x['value'] not in ('-', '')])
    ly, lm, lv = monthly[-1]
    return {'series': 'CUUR0000SA0', 'annual': annual, 'latest': {'year': ly, 'month': lm, 'value': lv}}


# ---------------------------------------------------------------- American Housing Survey 2023
JOBS = {'16': 'roof', '29': 'waterHeater', '26': 'centralAc', '27': 'heating', '33': 'fence', '15': 'deckPatio', '32': 'driveway', '20': 'insulation', '17': 'siding', '18': 'windowsDoors'}
SIZE_BINS = [('lt1000', ['1', '2', '3'], 'Under 1,000 sq ft'), ('1000', ['4'], '1,000 to 1,499 sq ft'), ('1500', ['5'], '1,500 to 1,999 sq ft'),
             ('2000', ['6'], '2,000 to 2,499 sq ft'), ('2500', ['7'], '2,500 to 2,999 sq ft'), ('3000', ['8'], '3,000 to 3,999 sq ft'), ('4000', ['9'], '4,000 sq ft or more')]


def wq(x, w, qs):
    o = np.argsort(x); x = np.asarray(x)[o]; w = np.asarray(w)[o]; c = np.cumsum(w) / w.sum()
    return [float(x[min(np.searchsorted(c, q), len(x) - 1)]) for q in qs]


def ahs(cp):
    h = pd.read_csv(raw('household.csv'), usecols=['CONTROL', 'WEIGHT', 'DIVISION', 'BLD', 'UNITSIZE'], dtype=str)
    p = pd.read_csv(raw('project.csv'), dtype=str)
    for c in h.columns: h[c] = h[c].str.strip("'")
    for c in p.columns: p[c] = p[c].str.strip("'")
    h['WEIGHT'] = h.WEIGHT.astype(float)
    d = p.merge(h, on='CONTROL')
    d['JOBCOST'] = pd.to_numeric(d.JOBCOST, errors='coerce')
    d = d[d.JOBCOST > 0].copy()
    # Année du chantier (définitions AHS 2023, « Primary year of work ») : achevé → année d'achèvement ; sinon année des dépenses.
    def year(r):
        for k in ('JOBCOMPYR', 'JOBWORKYR'):
            if r[k] in ('1', '2', '3'):
                return 2020 + int(r[k])
        return 2022
    d['YEAR'] = d.apply(year, axis=1)
    latest = cp['latest']['value']
    d['COST26'] = d.JOBCOST * d.YEAR.map(lambda y: latest / cp['annual'][y])

    def stats(s, col):
        q = wq(s[col].values, s.WEIGHT.values, [.25, .5, .75])
        return {'p25': round(q[0]), 'median': round(q[1]), 'p75': round(q[2]), 'n': int(len(s)), 'projects': int(round(s.WEIGHT.sum(), -3))}

    out = {}
    for code, key in JOBS.items():
        pro = d[(d.JOBTYPE == code) & (d.JOBDIY == '2')]
        diy = d[(d.JOBTYPE == code) & (d.JOBDIY == '1')]
        e = {'pro': stats(pro, 'COST26'), 'proNominal': stats(pro, 'JOBCOST'), 'diy': stats(diy, 'COST26') if len(diy) >= 30 else None, 'divisions': {}}
        for dv in range(1, 10):
            s = pro[pro.DIVISION == str(dv)]
            if len(s) >= 30:
                e['divisions'][str(dv)] = stats(s, 'COST26')
        out[key] = e
    roof = d[(d.JOBTYPE == '16') & (d.JOBDIY == '2') & (d.BLD == '02')]
    out['roof']['bySize'] = []
    for key, codes, lab in SIZE_BINS:
        s = roof[roof.UNITSIZE.isin(codes)]
        if len(s) >= 30:
            out['roof']['bySize'].append({'bin': key, 'label': lab, **stats(s, 'COST26')})
    return {'survey': 'American Housing Survey 2023, national public use file v1.1', 'jobsYears': '2021 to 2023',
            'cpi': {'series': cp['series'], 'to': f"{cp['latest']['year']}-{cp['latest']['month']:02d}", 'value': cp['latest']['value'], 'annual': cp['annual']},
            'jobs': out}


# ---------------------------------------------------------------- EIA
def energy():
    names = {n: slug(n) for _, n, _, _ in STATES}
    t = pd.read_excel(raw('table_5_06_b.xlsx'), header=None)
    label = str(t.iloc[1, 0]).strip()
    elec = {}
    for _, r in t.iterrows():
        n = str(r[0]).strip()
        if n in names:
            elec[names[n]] = float(r[1])
        if n == 'U.S. Total':
            elec['us'] = float(r[1])
    t5 = pd.read_excel(raw('table_5A.xlsx'), header=None)
    use = {}
    for _, r in t5.iterrows():
        n = str(r[0]).strip()
        if n in names:
            use[names[n]] = {'kwhMonth': round(float(r[2])), 'cents': round(float(r[3]), 2), 'bill': round(float(r[4]), 2)}
        if n in ('U.S. Total', 'U.S.'):
            use['us'] = {'kwhMonth': round(float(r[2])), 'cents': round(float(r[3]), 2), 'bill': round(float(r[4]), 2)}
    # Gaz naturel : moyenne de la saison de chauffe oct. 2025 – mars 2026 ($/Mcf).
    g = pd.read_excel(raw('NG_PRI_SUM_A_EPG0_PRS_DMCF_M.xls'), sheet_name='Data 1', header=2)
    g['Date'] = pd.to_datetime(g['Date'])
    season = g[(g.Date >= '2025-10-01') & (g.Date <= '2026-03-31')]
    gas = {}
    for c in g.columns[1:]:
        n = c.split(' Price of Natural Gas')[0]
        k = 'us' if n == 'U.S.' else names.get(n)
        v = pd.to_numeric(season[c], errors='coerce').dropna()
        if k and len(v) == 6:
            gas[k] = round(float(v.mean()), 2)
    # Propane et fioul : moyenne des relevés hebdomadaires d'oct. 2025 à mars 2026 ($/gal), États suivis par l'EIA.
    def weekly(fn, word):
        w = pd.read_excel(raw(fn), sheet_name='Data 1', header=2)
        w['Date'] = pd.to_datetime(w['Date'])
        s = w[(w.Date >= '2025-10-01') & (w.Date <= '2026-03-31')]
        o = {}
        for c in w.columns[1:]:
            n = c.replace('Weekly ', '').split(f' {word}')[0].strip()
            k = 'us' if n == 'U.S.' else names.get(n)
            v = pd.to_numeric(s[c], errors='coerce').dropna()
            if k and len(v) >= 10:
                o[k] = round(float(v.mean()), 3)
        return o
    propane = weekly('PET_PRI_WFR_A_EPLLPA_PRS_DPGAL_W.xls', 'Propane')
    oil = weekly('PET_PRI_WFR_A_EPD2F_PRS_DPGAL_W.xls', 'No. 2 Heating Oil')
    gw = pd.read_excel(raw('PET_PRI_GND_DCUS_NUS_W.xls'), sheet_name='Data 1', header=2)
    gw['Date'] = pd.to_datetime(gw['Date'])
    col = [c for c in gw.columns if 'Regular All Formulations' in c and 'U.S.' in c][0]
    last = gw.dropna(subset=[col]).iloc[-1]
    # RECS 2020, table CE4.6 : consommation moyenne pour le chauffage (MMBtu par ménage qui utilise le combustible).
    r = pd.read_excel(raw('recs2020_ce4.6.xlsx'), header=None)
    recs = {}
    want = {**{v: str(k) for k, v in DIVISIONS.items()}, 'All homes': 'us', 'Northeast': 'NE', 'Midwest': 'MW', 'South': 'S', 'West': 'W'}
    for _, row in r.iterrows():
        n = str(row[0]).strip()
        if n in want:
            val = lambda v: float(v) if isinstance(v, (int, float)) and not math.isnan(float(v)) else None
            recs[want[n]] = {'electricity': val(row[4]), 'gas': val(row[10]), 'propane': val(row[14]), 'oil': val(row[18])}
    m = re.search(r'through (\w+) (\d{4})', label)
    period_text = f'January to {m.group(1)} {m.group(2)}' if m else label
    return {'recsSpaceHeating': recs, 'electricity': {'centsPerKwh': elec, 'period': label, 'periodText': period_text}, 'consumption2024': use,
            'gas': {'dollarsPerMcf': gas, 'period': 'October 2025 to March 2026'},
            'propane': {'dollarsPerGallon': propane, 'period': 'October 2025 to March 2026'},
            'heatingOil': {'dollarsPerGallon': oil, 'period': 'October 2025 to March 2026'},
            'gasoline': {'dollarsPerGallon': round(float(last[col]), 3), 'week': str(last['Date'].date())}}


# ---------------------------------------------------------------- Solaire
def solar():
    pv = {}
    pvdir = os.path.join(RAW, 'pvwatts')
    cities = {}
    for line in open(os.path.join(pvdir, 'cities.tsv')):
        ab, city, lat, lon = line.rstrip('\n').split('\t')
        cities[ab] = (city, float(lat), float(lon))
    for ab, name, _, _ in STATES:
        f = os.path.join(pvdir, f'{ab}.json')
        if os.path.exists(f):
            j = json.load(open(f))
            if 'outputs' in j and j['outputs'].get('ac_annual'):
                pv[slug(name)] = {'kwhPerKw': round(j['outputs']['ac_annual']), 'city': cities[ab][0], 'station': j.get('station_info', {}).get('weather_data_source')}
    ny = json.load(open(raw('ny-solar-2025.json')))
    x = [float(r['project_cost']) / float(r['totalnameplatekwdc']) / 1000 for r in ny
         if r.get('project_cost') and r.get('totalnameplatekwdc') and 2.5 <= float(r['totalnameplatekwdc']) <= 20]
    x = [v for v in x if 0.75 <= v <= 10]
    q = np.percentile(x, [20, 50, 80])
    w = [float(r['totalnameplatekwdc']) * 1000 / float(r['pv_module_quantity']) for r in ny if r.get('pv_module_quantity') and float(r['pv_module_quantity']) > 0 and r.get('totalnameplatekwdc')]
    return {'pvwatts': pv, 'nyPanelWattsMedian': round(float(np.median(w))), 'nyReported2025': {'p20': round(float(q[0]), 2), 'median': round(float(q[1]), 2), 'p80': round(float(q[2]), 2), 'n': len(x),
            'filter': 'Residential, purchased, complete, installed in 2025, 2.5 to 20 kWdc, $0.75 to $10/W'}}


if __name__ == '__main__':
    cp = cpi()
    states = [{'slug': slug(n), 'name': n, 'abbr': ab, 'fips': f, 'division': dv, 'divisionName': DIVISIONS[dv]} for ab, n, f, dv in STATES]
    data = {'states.json': states, 'wages.json': wages(), 'shares.json': shares(), 'ahs.json': ahs(cp), 'energy.json': energy(), 'solar.json': solar()}
    for fn, obj in data.items():
        json.dump(obj, open(os.path.join(OUT, fn), 'w'), indent=1, ensure_ascii=False)
        print('wrote', fn)
