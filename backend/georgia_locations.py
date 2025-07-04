#!/usr/bin/env python3
"""
Georgia Locations Database
Contains coordinate data for Georgia cities, towns, counties, and unincorporated communities
"""

# Dictionary of Georgia cities, towns, and unincorporated communities with coordinates
# Format: 'NAME': (latitude, longitude)
# Coordinates are approximate centers of the locations
GA_CITIES = {
    # Major cities
    'ATLANTA': (33.7490, -84.3880),
    'AUGUSTA': (33.4735, -82.0105),
    'COLUMBUS': (32.4609, -84.9877),
    'SAVANNAH': (32.0835, -81.0998),
    'ATHENS': (33.9519, -83.3576),
    'MACON': (32.8407, -83.6324),
    'ALBANY': (31.5785, -84.1557),
    'ROSWELL': (34.0232, -84.3616),
    'SANDY SPRINGS': (33.9304, -84.3733),
    'JOHNS CREEK': (34.0289, -84.1986),
    'SOUTH FULTON': (33.5776, -84.5947),
    'WARNER ROBINS': (32.6130, -83.6241),
    'VALDOSTA': (30.8327, -83.2785),
    'ALPHARETTA': (34.0754, -84.2941),
    'MARIETTA': (33.9526, -84.5499),
    'SMYRNA': (33.8840, -84.5144),
    'DUNWOODY': (33.9462, -84.3346),
    'BROOKHAVEN': (33.8651, -84.3365),
    'ROME': (34.2570, -85.1647),
    'GAINESVILLE': (34.2979, -83.8241),
    'PEACHTREE CORNERS': (33.9698, -84.2214),
    'NEWNAN': (33.3806, -84.7997),
    'HINESVILLE': (31.8468, -81.5960),
    'DALTON': (34.7698, -84.9700),
    'KENNESAW': (34.0234, -84.6155),
    'DOUGLASVILLE': (33.7515, -84.7477),
    'CARROLLTON': (33.5857, -85.0766),
    'STATESBORO': (32.4490, -81.7830),
    'LAGRANGE': (33.0362, -85.0322),
    'LAWRENCEVILLE': (33.9562, -83.9879),
    
    # Medium-sized cities and towns
    'CANTON': (34.2367, -84.4908),
    'TUCKER': (33.8545, -84.2155),
    'WOODSTOCK': (34.1015, -84.5193),
    'FOREST PARK': (33.6221, -84.3690),
    'SUWANEE': (34.0518, -84.0713),
    'ACWORTH': (34.0659, -84.6768),
    'CARTERSVILLE': (34.1651, -84.8010),
    'DECATUR': (33.7748, -84.2963),
    'MILLEDGEVILLE': (33.0801, -83.2320),
    'AMERICUS': (32.0724, -84.2326),
    'BAINBRIDGE': (30.9031, -84.5754),
    'BRUNSWICK': (31.1499, -81.4914),
    'BUFORD': (34.1206, -84.0044),
    'CAIRO': (30.8774, -84.2013),
    'CALHOUN': (34.5023, -84.9513),
    'CAMILLA': (31.2316, -84.2107),
    'CHAMBLEE': (33.8879, -84.3054),
    'CLARKSTON': (33.8101, -84.2388),
    'COLLEGE PARK': (33.6534, -84.4494),
    'CONYERS': (33.6676, -84.0176),
    'CORDELE': (31.9644, -83.7825),
    'COVINGTON': (33.5968, -83.8601),
    'CUMMING': (34.2073, -84.1402),
    'DACULA': (33.9883, -83.8985),
    'DALLAS': (33.9218, -84.8408),
    'DAHLONEGA': (34.5261, -83.9844),
    'DALTON': (34.7698, -84.9700),
    'DORAVILLE': (33.9190, -84.2802),
    'DUBLIN': (32.5404, -82.9036),
    'EAST POINT': (33.6795, -84.4394),
    'ELBERTON': (34.1126, -82.8654),
    'FAIRBURN': (33.5643, -84.5811),
    'FAYETTEVILLE': (33.4487, -84.4548),
    'FITZGERALD': (31.7149, -83.2538),
    'FLOWERY BRANCH': (34.1851, -83.9252),
    'FORT OGLETHORPE': (34.9490, -85.2549),
    'FORT VALLEY': (32.5535, -83.8869),
    'GRIFFIN': (33.2468, -84.2641),
    'HAMPTON': (33.3793, -84.2927),
    'JESUP': (31.6076, -81.8854),
    'KINGSLAND': (30.7990, -81.6898),
    'LILBURN': (33.8898, -84.1430),
    'LOGANVILLE': (33.8387, -83.8985),
    'MCDONOUGH': (33.4473, -84.1471),
    'MONROE': (33.7948, -83.7132),
    'MOULTRIE': (31.1801, -83.7879),
    'NORCROSS': (33.9412, -84.2135),
    'PERRY': (32.4582, -83.7322),
    'POWDER SPRINGS': (33.8595, -84.6830),
    'RIVERDALE': (33.5726, -84.4132),
    'SNELLVILLE': (33.8573, -84.0199),
    'STOCKBRIDGE': (33.5437, -84.2340),
    'SUGAR HILL': (34.1188, -84.0330),
    'THOMASVILLE': (30.8368, -83.9788),
    'THOMSON': (33.4710, -82.5043),
    'TIFTON': (31.4502, -83.5085),
    'TOCCOA': (34.5776, -83.3307),
    'TYRONE': (33.4762, -84.5977),
    'UNION CITY': (33.5871, -84.5424),
    'VIDALIA': (32.2182, -82.4135),
    'VILLA RICA': (33.7309, -84.9173),
    'WAYNESBORO': (33.0899, -82.0182),
    'WAYCROSS': (31.2135, -82.3541),
    'WINDER': (33.9974, -83.7205),
    
    # Smaller towns and unincorporated communities
    'ADAIRSVILLE': (34.3712, -84.9346),
    'ADEL': (31.1396, -83.4254),
    'ALAMO': (32.1471, -82.7793),
    'ALMA': (31.5377, -82.4615),
    'ALSTON': (32.0896, -82.4807),
    'ARABI': (31.8296, -83.7259),
    'ARLINGTON': (31.4399, -84.7246),
    'ASHBURN': (31.7060, -83.6532),
    'ATTAPULGUS': (30.7454, -84.4838),
    'AUBURN': (34.0167, -83.8346),
    'AUSTELL': (33.8126, -84.6343),
    'AVERA': (33.1943, -82.5287),
    'AVONDALE ESTATES': (33.7715, -84.2635),
    'BACONTON': (31.3843, -84.1585),
    'BAXLEY': (31.7793, -82.3470),
    'BLACKSHEAR': (31.3085, -82.2510),
    'BLAIRSVILLE': (34.8762, -83.9582),
    'BLAKELY': (31.3768, -84.9341),
    'BLUE RIDGE': (34.8643, -84.3243),
    'BOSTON': (30.7909, -83.7898),
    'BOWDON': (33.5374, -85.2574),
    'BOWERSVILLE': (34.3773, -83.0954),
    'BOWMAN': (34.2057, -83.0321),
    'BREMEN': (33.7215, -85.1455),
    'BROOKLET': (32.3857, -81.6671),
    'BUENA VISTA': (32.3193, -84.5174),
    'BUTLER': (32.5585, -84.2385),
    'BYROMVILLE': (32.1979, -83.9046),
    'BYRON': (32.6532, -83.7540),
    'CAVE SPRING': (34.1073, -85.3366),
    'CEDARTOWN': (34.0176, -85.2566),
    'CENTERVILLE': (32.6304, -83.6874),
    'CHATSWORTH': (34.7665, -84.7704),
    'CHICKAMAUGA': (34.8709, -85.2905),
    'CLAXTON': (32.1621, -81.9068),
    'CLAYTON': (34.8762, -83.4013),
    'CLEVELAND': (34.5968, -83.7649),
    'CLIMAX': (30.8746, -84.4296),
    'COHUTTA': (34.9595, -84.9555),
    'COLBERT': (34.0351, -83.2154),
    'COLEMAN': (31.6582, -84.8935),
    'COLQUITT': (31.1724, -84.7327),
    'COMMERCE': (34.2143, -83.4571),
    'COOLIDGE': (31.0148, -83.8726),
    'COOSA': (34.2668, -85.3180),
    'CORNELIA': (34.5115, -83.5249),
    'CUSSETA': (32.3085, -84.7796),
    'DARIEN': (31.3699, -81.4346),
    'DAWSON': (31.7738, -84.4465),
    'DAWSONVILLE': (34.4212, -84.1191),
    'DONALSONVILLE': (31.0446, -84.8805),
    'EDISON': (31.5593, -84.7366),
    'EATONTON': (33.3268, -83.3885),
    'EDGEHILL': (32.7743, -82.6046),
    'ELLAVILLE': (32.2385, -84.3082),
    'ELLIJAY': (34.6948, -84.4821),
    'EMERSON': (34.1257, -84.7588),
    'ETON': (34.8260, -84.7618),
    'EUHARLEE': (34.1473, -84.9313),
    'FARGO': (30.6832, -82.5665),
    'FOLKSTON': (30.8313, -82.0110),
    'FOREST PARK': (33.6215, -84.3690),
    'FORSYTH': (33.0346, -83.9382),
    'FORT GAINES': (31.6096, -85.0480),
    'FRANKLIN': (33.2774, -85.0983),
    'FRANKLIN SPRINGS': (34.2851, -83.1449),
    'GARDEN CITY': (32.1146, -81.1568),
    'GIBSON': (33.2304, -82.5954),
    'GILLSVILLE': (34.3082, -83.6374),
    'GLENNVILLE': (31.9354, -81.9279),
    'GORDON': (32.8862, -83.3343),
    'GRANTVILLE': (33.2382, -84.8338),
    'GRAY': (33.0096, -83.5332),
    'GREENSBORO': (33.5776, -83.1821),
    'GREENVILLE': (33.0293, -84.7130),
    'HARTWELL': (34.3529, -82.9324),
    'HAWKINSVILLE': (32.2829, -83.4724),
    'HAZLEHURST': (31.8696, -82.5943),
    'HELEN': (34.7015, -83.7316),
    'HEPHZIBAH': (33.3168, -82.0962),
    'HIAWASSEE': (34.9493, -83.7574),
    'HIRAM': (33.8926, -84.7702),
    'HOGANSVILLE': (33.1718, -84.9180),
    'HOMERVILLE': (31.0409, -82.7343),
    'HULL': (34.0040, -83.2988),
    'ILA': (34.1740, -83.2963),
    'JASPER': (34.4676, -84.4321),
    'JEFFERSON': (34.1168, -83.5723),
    'JONESBORO': (33.5226, -84.3535),
    'JUNCTION CITY': (32.5940, -84.4449),
    'KEYSVILLE': (33.2360, -82.2293),
    'KINGSTON': (34.2426, -84.9386),
    'LAFAYETTE': (34.7065, -85.2788),
    'LAKE CITY': (33.6176, -84.3335),
    'LAKELAND': (31.0418, -83.0746),
    'LAVONIA': (34.4323, -83.1093),
    'LEARY': (31.4897, -84.5138),
    'LEESBURG': (31.7332, -84.1710),
    'LENOX': (31.2710, -83.4729),
    'LEXINGTON': (33.8701, -83.1115),
    'LINCOLNTON': (33.7932, -82.4765),
    'LITHONIA': (33.7123, -84.1068),
    'LOCUST GROVE': (33.3437, -84.1068),
    'LOOKOUT MOUNTAIN': (34.9718, -85.3613),
    'LOUISVILLE': (33.0015, -82.4115),
    'LUDOWICI': (31.7118, -81.7415),
    'LULA': (34.3912, -83.6604),
    'LUMPKIN': (32.0529, -84.7988),
    'LYONS': (32.2068, -82.3210),
    'MABLETON': (33.8182, -84.5824),
    'MADISON': (33.5957, -83.4721),
    'MANCHESTER': (32.8604, -84.6352),
    'MANSFIELD': (33.5176, -83.7337),
    'MARSHALLVILLE': (32.4557, -83.9385),
    'MAYSVILLE': (34.2551, -83.5618),
    'MCRAE-HELENA': (32.0673, -82.9018),
    'MEANSVILLE': (33.0518, -84.3127),
    'MEIGS': (31.0724, -84.0832),
    'MENLO': (34.4823, -85.4766),
    'MIDVILLE': (32.8218, -82.2318),
    'MIDWAY': (31.8049, -81.4115),
    'MILAN': (32.0096, -83.0571),
    'MILLEN': (32.8046, -81.9446),
    'MILNER': (33.1226, -84.1971),
    'MITCHELL': (33.2182, -82.7049),
    'MOLENA': (32.9913, -84.4938),
    'MONTEZUMA': (32.3018, -84.0318),
    'MONTICELLO': (33.3029, -83.6824),
    'MORELAND': (33.2874, -84.7699),
    'MORGAN': (31.5351, -84.5974),
    'MORGANTON': (34.8773, -84.2496),
    'MORROW': (33.5832, -84.3396),
    'MOUNTAIN CITY': (34.9190, -83.3832),
    'MOUNTAIN PARK': (34.0793, -84.4277),
    'NAHUNTA': (31.2046, -81.9821),
    'NASHVILLE': (31.2085, -83.2482),
    'NELSON': (34.3823, -84.3718),
    'NEWINGTON': (32.5860, -81.5029),
    'NICHOLLS': (31.5196, -82.6343),
    'NORMAN PARK': (31.2729, -83.6907),
    'NORWOOD': (33.4637, -82.7074),
    'OAKWOOD': (34.2290, -83.8849),
    'OCHLOCKNEE': (30.9757, -84.0510),
    'OCILLA': (31.5960, -83.2513),
    'OCONEE': (32.8554, -83.6001),
    'OGLETHORPE': (32.2944, -84.0604),
    'OXFORD': (33.6218, -83.8702),
    'PALMETTO': (33.5193, -84.6691),
    'PATTERSON': (31.3865, -82.1357),
    'PAVO': (30.9582, -83.7374),
    'PEARSON': (31.2985, -82.8557),
    'PELHAM': (31.1274, -84.1524),
    'PEMBROKE': (32.1446, -81.6176),
    'PINE LAKE': (33.7901, -84.2049),
    'PINE MOUNTAIN': (32.8657, -84.8491),
    'PITTS': (31.9454, -83.5413),
    'PLAINS': (32.0346, -84.3927),
    'POOLER': (32.1151, -81.2496),
    'PORT WENTWORTH': (32.1971, -81.2201),
    'PORTAL': (32.5374, -81.9329),
    'POULAN': (31.5129, -83.7893),
    'QUITMAN': (30.7882, -83.5602),
    'REIDSVILLE': (32.0868, -82.1221),
    'REMERTON': (30.8488, -83.2868),
    'RESACA': (34.5776, -84.9422),
    'RHINE': (32.0285, -83.2018),
    'RICHLAND': (32.0874, -84.6635),
    'RINCON': (32.2954, -81.2357),
    'RINGGOLD': (34.9162, -85.1091),
    'ROBERTA': (32.7204, -84.0163),
    'ROCHELLE': (31.9485, -83.4571),
    'ROCKMART': (34.0007, -85.0416),
    'ROCKY FORD': (32.6574, -81.8374),
    'ROOPVILLE': (33.4579, -85.1321),
    'ROSSVILLE': (34.9832, -85.2871),
    'ROYSTON': (34.2871, -83.1093),
    'RUTLEDGE': (33.6254, -83.6074),
    'SALE CITY': (31.2621, -84.0199),
    'SANDERSVILLE': (32.9807, -82.8104),
    'SANTA CLAUS': (32.1743, -82.3346),
    'SARDIS': (32.9868, -81.7615),
    'SASSER': (31.7196, -84.3474),
    'SAVANNAH BEACH': (32.0054, -80.8454),
    'SCOTLAND': (32.0451, -82.8176),
    'SCREVEN': (31.4893, -81.9465),
    'SENOIA': (33.3029, -84.5516),
    'SHADY DALE': (33.3971, -83.5979),
    'SHARON': (33.5601, -82.7932),
    'SHARPSBURG': (33.3398, -84.6571),
    'SHELLMAN': (31.7590, -84.6124),
    'SILVERCREEK': (33.7951, -84.0299),
    'SMITHVILLE': (31.9043, -84.2513),
    'SOCIAL CIRCLE': (33.6543, -83.7135),
    'SOPERTON': (32.3760, -82.5932),
    'SPARKS': (31.1682, -83.4374),
    'SPRINGFIELD': (32.3618, -81.3107),
    'ST. MARYS': (30.7407, -81.5457),
    'STAPLETON': (33.2151, -82.4673),
    'STILLMORE': (32.4413, -82.2171),
    'STONE MOUNTAIN': (33.8082, -84.1702),
    'SURRENCY': (31.7252, -82.1912),
    'SWAINSBORO': (32.5960, -82.3346),
    'SYCAMORE': (31.6793, -83.6349),
    'SYLVANIA': (32.7504, -81.6365),
    'SYLVESTER': (31.5307, -83.8352),
    'TALLULAH FALLS': (34.7371, -83.3907),
    'TALMO': (34.1812, -83.7163),
    'TARRYTOWN': (32.3188, -82.5599),
    'TAYLORSVILLE': (34.0843, -85.0077),
    'TEMPLE': (33.7365, -85.0305),
    'TENNILLE': (32.9318, -82.8110),
    'TALKING ROCK': (34.5394, -84.5093),
    'TALLAPOOSA': (33.7623, -85.2885),
    'TALLULAH FALLS': (34.7371, -83.3907),
    'TALMO': (34.1812, -83.7163),
    'TARRYTOWN': (32.3188, -82.5599),
    'TAYLORSVILLE': (34.0843, -85.0077),
    'TEMPLE': (33.7365, -85.0305),
    'TENNILLE': (32.9318, -82.8110),
    'TIGER': (34.8482, -83.4324),
    'TIGNALL': (33.8671, -82.7449),
    'TOOMSBORO': (32.8246, -83.0843),
    'TRENTON': (34.8715, -85.5099),
    'TRION': (34.5465, -85.3116),
    'TUNNEL HILL': (34.8404, -85.0722),
    'TWIN CITY': (32.5813, -82.1535),
    'TY TY': (31.4721, -83.6518),
    'UNADILLA': (32.2613, -83.7360),
    'UNION POINT': (33.6151, -83.0741),
    'UVALDA': (32.0396, -82.5068),
    'VIENNA': (32.0924, -83.7957),
    'WACO': (33.7037, -85.1883),
    'WADLEY': (32.8688, -82.4062),
    'WALESKA': (34.3173, -84.5505),
    'WALTHOURVILLE': (31.7768, -81.6285),
    'WARM SPRINGS': (32.8857, -84.6790),
    'WARRENTON': (33.4082, -82.6626),
    'WARWICK': (31.8324, -83.9185),
    'WASHINGTON': (33.7376, -82.7390),
    'WATKINSVILLE': (33.8651, -83.4079),
    'WAVERLY HALL': (32.6804, -84.7385),
    'WAYCROSS': (31.2135, -82.3541),
    'WAYNESBORO': (33.0899, -82.0182),
    'WEST POINT': (32.8785, -85.1824),
    'WHIGHAM': (30.8849, -84.3246),
    'WHITE': (34.2829, -84.7466),
    'WHITE PLAINS': (33.4743, -83.0376),
    'WHITESBURG': (33.4937, -84.9144),
    'WILLACOOCHEE': (31.3410, -83.0471),
    'WILLIAMSON': (33.1804, -84.3566),
    'WINDER': (33.9974, -83.7205),
    'WINTERVILLE': (33.9665, -83.2804),
    'WOODBINE': (30.9613, -81.7207),
    'WOODBURY': (32.9846, -84.5824),
    'WOODLAND': (32.7885, -84.5643),
    'WOODSTOCK': (34.1015, -84.5193),
    'WRENS': (33.2079, -82.3848),
    'WRIGHTSVILLE': (32.7276, -82.7193),
    'YATESVILLE': (32.9121, -84.1399),
    'YOUNG HARRIS': (34.9329, -83.8491),
    'ZEBULON': (33.1018, -84.3427),
}

# Dictionary of Georgia counties with coordinates (county seats or approximate centers)
# Format: 'NAME': (latitude, longitude)
GA_COUNTIES = {
    'APPLING': (31.7484, -82.2890),
    'ATKINSON': (31.2900, -82.8700),
    'BACON': (31.5500, -82.4500),
    'BAKER': (31.3300, -84.4500),
    'BALDWIN': (33.0900, -83.2400),
    'BANKS': (34.3500, -83.4900),
    'BARROW': (33.9900, -83.7200),
    'BARTOW': (34.2400, -84.8400),
    'BEN HILL': (31.7600, -83.2200),
    'BERRIEN': (31.2700, -83.2200),
    'BIBB': (32.8407, -83.6324),
    'BLECKLEY': (32.4300, -83.3300),
    'BRANTLEY': (31.2000, -82.0000),
    'BROOKS': (30.8300, -83.5800),
    'BRYAN': (32.0000, -81.4400),
    'BULLOCH': (32.3900, -81.7400),
    'BURKE': (33.0600, -82.0000),
    'BUTTS': (33.2800, -83.9500),
    'CALHOUN': (31.5300, -84.6200),
    'CAMDEN': (30.9200, -81.6500),
    'CANDLER': (32.4000, -82.0700),
    'CARROLL': (33.5857, -85.0766),
    'CATOOSA': (34.9000, -85.1300),
    'CHARLTON': (30.7800, -82.1300),
    'CHATHAM': (32.0835, -81.0998),
    'CHATTAHOOCHEE': (32.3400, -84.7900),
    'CHATTOOGA': (34.4700, -85.3400),
    'CHEROKEE': (34.2400, -84.4700),
    'CLARKE': (33.9519, -83.3576),
    'CLAY': (31.6200, -84.9900),
    'CLAYTON': (33.5400, -84.3500),
    'CLINCH': (30.9200, -82.7000),
    'COBB': (33.9400, -84.5300),
    'COFFEE': (31.5400, -82.8500),
    'COLQUITT': (31.1900, -83.7700),
    'COLUMBIA': (33.5500, -82.2500),
    'COOK': (31.1500, -83.4300),
    'COWETA': (33.3500, -84.7600),
    'CRAWFORD': (32.7100, -84.0000),
    'CRISP': (31.9300, -83.7600),
    'DADE': (34.8400, -85.5000),
    'DAWSON': (34.4400, -84.1700),
    'DECATUR': (30.8700, -84.5700),
    'DEKALB': (33.7700, -84.2300),
    'DODGE': (32.1700, -83.1600),
    'DOOLY': (32.1500, -83.7900),
    'DOUGHERTY': (31.5800, -84.2100),
    'DOUGLAS': (33.7000, -84.7700),
    'EARLY': (31.3200, -84.9100),
    'ECHOLS': (30.6000, -82.9600),
    'EFFINGHAM': (32.3700, -81.3400),
    'ELBERT': (34.1100, -82.8700),
    'EMANUEL': (32.5900, -82.3000),
    'EVANS': (32.1600, -81.8800),
    'FANNIN': (34.8700, -84.3200),
    'FAYETTE': (33.4100, -84.4900),
    'FLOYD': (34.2600, -85.2100),
    'FORSYTH': (34.2200, -84.1300),
    'FRANKLIN': (34.3700, -83.2300),
    'FULTON': (33.7490, -84.3880),
    'GILMER': (34.6900, -84.4600),
    'GLASCOCK': (33.2300, -82.6000),
    'GLYNN': (31.2100, -81.4900),
    'GORDON': (34.5000, -84.8700),
    'GRADY': (30.8800, -84.2500),
    'GREENE': (33.5800, -83.1700),
    'GWINNETT': (33.9600, -84.0200),
    'HABERSHAM': (34.6300, -83.5300),
    'HALL': (34.3200, -83.8300),
    'HANCOCK': (33.2800, -83.0000),
    'HARALSON': (33.7900, -85.2100),
    'HARRIS': (32.7300, -84.9000),
    'HART': (34.3500, -82.9600),
    'HEARD': (33.2900, -85.1200),
    'HENRY': (33.4500, -84.1500),
    'HOUSTON': (32.4600, -83.6600),
    'IRWIN': (31.6000, -83.2700),
    'JACKSON': (34.1300, -83.5600),
    'JASPER': (33.3100, -83.6800),
    'JEFF DAVIS': (31.8100, -82.6300),
    'JEFFERSON': (33.0500, -82.4100),
    'JENKINS': (32.8000, -81.9700),
    'JOHNSON': (32.7000, -82.6600),
    'JONES': (33.0200, -83.5600),
    'LAMAR': (33.0700, -84.1400),
    'LANIER': (31.0400, -83.0600),
    'LAURENS': (32.4600, -82.9200),
    'LEE': (31.7800, -84.1500),
    'LIBERTY': (31.8200, -81.4900),
    'LINCOLN': (33.7900, -82.4800),
    'LONG': (31.7300, -81.7400),
    'LOWNDES': (30.8300, -83.2700),
    'LUMPKIN': (34.5700, -84.0000),
    'MACON': (32.3500, -84.0400),
    'MADISON': (34.1300, -83.2100),
    'MARION': (32.3500, -84.5300),
    'MCDUFFIE': (33.4800, -82.5000),
    'MCINTOSH': (31.4900, -81.3700),
    'MERIWETHER': (33.0400, -84.6800),
    'MILLER': (31.1600, -84.7300),
    'MITCHELL': (31.2200, -84.1900),
    'MONROE': (33.0100, -83.9200),
    'MONTGOMERY': (32.1700, -82.5300),
    'MORGAN': (33.5900, -83.4900),
    'MURRAY': (34.7900, -84.7400),
    'MUSCOGEE': (32.5100, -84.8700),
    'NEWTON': (33.5500, -83.8500),
    'OCONEE': (33.8300, -83.4300),
    'OGLETHORPE': (33.8800, -83.0800),
    'PAULDING': (33.9200, -84.8700),
    'PEACH': (32.5700, -83.8200),
    'PICKENS': (34.4600, -84.4600),
    'PIERCE': (31.3500, -82.2100),
    'PIKE': (33.0900, -84.3800),
    'POLK': (34.0000, -85.1800),
    'PULASKI': (32.2400, -83.4700),
    'PUTNAM': (33.3200, -83.3700),
    'QUITMAN': (31.8600, -85.0000),
    'RABUN': (34.8800, -83.4000),
    'RANDOLPH': (31.7700, -84.7500),
    'RICHMOND': (33.3600, -82.0700),
    'ROCKDALE': (33.6500, -84.0200),
    'SCHLEY': (32.2600, -84.3100),
    'SCREVEN': (32.7500, -81.6200),
    'SEMINOLE': (30.9300, -84.8600),
    'SPALDING': (33.2600, -84.2800),
    'STEPHENS': (34.5500, -83.2900),
    'STEWART': (32.0800, -84.8300),
    'SUMTER': (32.0400, -84.2000),
    'TALBOT': (32.7000, -84.5300),
    'TALIAFERRO': (33.5600, -82.8800),
    'TATTNALL': (32.0400, -82.0500),
    'TAYLOR': (32.5500, -84.2500),
    'TELFAIR': (31.9300, -82.9300),
    'TERRELL': (31.7700, -84.4400),
    'THOMAS': (30.8600, -83.9200),
    'TIFT': (31.4500, -83.5200),
    'TOOMBS': (32.1200, -82.3200),
    'TOWNS': (34.9100, -83.7300),
    'TREUTLEN': (32.4000, -82.5700),
    'TROUP': (33.0300, -85.0200),
    'TURNER': (31.7100, -83.6200),
    'TWIGGS': (32.6700, -83.4300),
    'UNION': (34.8200, -83.9900),
    'UPSON': (32.9000, -84.3000),
    'WALKER': (34.7300, -85.3000),
    'WALTON': (33.7800, -83.7300),
    'WARE': (31.0500, -82.4100),
    'WARREN': (33.4100, -82.6700),
    'WASHINGTON': (32.9600, -82.7900),
    'WAYNE': (31.5500, -81.9100),
    'WEBSTER': (32.0400, -84.5500),
    'WHEELER': (32.1200, -82.7200),
    'WHITE': (34.6400, -83.7500),
    'WHITFIELD': (34.8000, -84.9700),
    'WILCOX': (31.9700, -83.4300),
    'WILKES': (33.7800, -82.7400),
    'WILKINSON': (32.8000, -83.1700),
    'WORTH': (31.5500, -83.8500),
}

def get_city_coordinates(city_name):
    """Get coordinates for a Georgia city by name"""
    if not city_name:
        return None, None, False
    
    city_upper = city_name.upper()
    if city_upper in GA_CITIES:
        return GA_CITIES[city_upper][0], GA_CITIES[city_upper][1], True
    
    return None, None, False

def get_county_coordinates(county_name):
    """Get coordinates for a Georgia county by name"""
    if not county_name:
        return None, None, False
    
    # Remove "County" suffix if present
    county_clean = county_name.upper().replace(' COUNTY', '')
    
    if county_clean in GA_COUNTIES:
        return GA_COUNTIES[county_clean][0], GA_COUNTIES[county_clean][1], True
    
    return None, None, False

def get_coordinates(city=None, county=None, fallback_city=None):
    """
    Get coordinates using prioritized lookup:
    1. Try city first
    2. If no match, try county
    3. If no match, try fallback city
    Returns: (latitude, longitude, found_flag)
    """
    # Try city first
    lat, lng, found = get_city_coordinates(city)
    if found:
        return lat, lng, True
    
    # Try county next
    lat, lng, found = get_county_coordinates(county)
    if found:
        return lat, lng, True
    
    # Try fallback city last
    if fallback_city:
        lat, lng, found = get_city_coordinates(fallback_city)
        if found:
            return lat, lng, True
    
    # No coordinates found
    return None, None, False