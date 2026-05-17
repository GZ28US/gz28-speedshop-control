export const years = [
  2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017,
  2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026,
]

export const manufacturersByYear: Record<number, string[]> = {
  2009: ['MOPAR'],
  2010: ['MOPAR'],
  2011: ['MOPAR'],
  2012: ['MOPAR'],
  2013: ['MOPAR'],
  2014: ['GM'],
  2015: ['MOPAR', 'GM'],
  2016: ['MOPAR', 'GM'],
  2017: ['MOPAR', 'GM', 'FORD'],
  2018: ['MOPAR', 'GM', 'FORD'],
  2019: ['MOPAR', 'GM', 'FORD'],
  2020: ['MOPAR', 'GM', 'FORD'],
  2021: ['MOPAR', 'GM', 'FORD'],
  2022: ['MOPAR', 'GM', 'FORD'],
  2023: ['MOPAR', 'GM', 'FORD'],
  2024: ['MOPAR', 'GM', 'FORD'],
  2025: ['MOPAR', 'GM'],
  2026: ['MOPAR', 'GM'],
}

export const brandsByManufacturerAndYear: Record<string, Record<number, string[]>> = {
  MOPAR: {
    2009: ['RAM'], 2010: ['RAM'], 2011: ['RAM'], 2012: ['RAM'], 2013: ['RAM'],
    2014: ['RAM'], 2015: ['RAM'], 2016: ['RAM'], 2017: ['RAM'], 2018: ['DODGE', 'RAM'],
    2019: ['DODGE'], 2020: ['DODGE'], 2021: ['DODGE'], 2022: ['DODGE'], 2023: ['DODGE'],
    2024: ['DODGE'], 2025: ['DODGE'], 2026: ['DODGE'],
  },
  GM: {
    2014: ['CHEVROLET'], 2015: ['CHEVROLET'], 2016: ['CHEVROLET'], 2017: ['CHEVROLET'],
    2018: ['CHEVROLET'], 2019: ['CHEVROLET'], 2020: ['CHEVROLET'], 2021: ['CHEVROLET'],
    2022: ['CHEVROLET'], 2023: ['CHEVROLET'], 2024: ['CHEVROLET'], 2025: ['CHEVROLET'], 2026: ['CHEVROLET'],
  },
  FORD: {
    2017: ['FORD'], 2018: ['FORD'], 2019: ['FORD'], 2020: ['FORD'],
    2021: ['FORD'], 2022: ['FORD'], 2023: ['FORD'], 2024: ['FORD'],
  },
}

export const modelsByBrandAndYear: Record<string, Record<number, string[]>> = {
  DODGE: {
    2018: ['CHALLENGER', 'CHARGER'],
    2019: ['CHALLENGER', 'CHARGER'],
    2020: ['CHALLENGER', 'CHARGER'],
    2021: ['CHALLENGER', 'CHARGER', 'DURANGO'],
    2022: ['CHALLENGER', 'CHARGER'],
    2023: ['CHALLENGER', 'CHARGER', 'DURANGO'],
    2024: ['CHALLENGER', 'CHARGER', 'DURANGO'],
    2025: ['DURANGO'],
    2026: ['DURANGO'],
  },
  RAM: {
    2009: ['1500'], 2010: ['1500'], 2011: ['1500'], 2012: ['1500'], 2013: ['1500'],
    2014: ['1500'], 2015: ['1500'], 2016: ['1500'], 2017: ['1500'], 2018: ['1500'],
  },
  CHEVROLET: {
    2014: ['CORVETTE'], 2015: ['CORVETTE'], 2016: ['CAMARO', 'CORVETTE'], 2017: ['CAMARO', 'CORVETTE'],
    2018: ['CAMARO', 'CORVETTE'], 2019: ['CAMARO', 'CORVETTE'], 2020: ['CAMARO', 'CORVETTE'],
    2021: ['CAMARO', 'CORVETTE'], 2022: ['CAMARO', 'CORVETTE'], 2023: ['CAMARO', 'CORVETTE'],
    2024: ['CAMARO', 'CORVETTE'], 2025: ['CORVETTE'], 2026: ['CORVETTE'],
  },
  FORD: {
    2017: ['F150'], 2018: ['F150'], 2019: ['F150'], 2020: ['F150'],
    2021: ['F150'], 2022: ['F150'], 2023: ['F150'], 2024: ['F150'],
  },
}

export const versionsByModelAndYear: Record<string, Record<number, string[]>> = {
  CHALLENGER: {
    2018: ['R/T 5.7', 'R/T ScatPack 6.4', 'SRT 392 6.4', 'SRT HellCat 6.2', 'SRT HellCat WideBody 6.2', 'SRT Demon 6.2'],
    2019: ['R/T 5.7', 'R/T ScatPack 6.4', 'R/T ScatPack WideBody 6.4', 'SRT HellCat 6.2', 'SRT HellCat WideBody 6.2', 'SRT HellCat RedEye 6.2', 'SRT HellCat RedEye WideBody 6.2'],
    2020: ['R/T 5.7', 'R/T ScatPack 6.4', 'R/T ScatPack WideBody 6.4', 'SRT HellCat 6.2', 'SRT HellCat WideBody 6.2', 'SRT HellCat RedEye 6.2', 'SRT HellCat RedEye WideBody 6.2', 'SRT HellCat RedEye SuperStock 6.2'],
    2021: ['R/T 5.7', 'R/T ScatPack 6.4', 'R/T ScatPack WideBody 6.4', 'SRT HellCat 6.2', 'SRT HellCat WideBody 6.2', 'SRT HellCat RedEye 6.2', 'SRT HellCat RedEye WideBody 6.2', 'SRT HellCat RedEye SuperStock 6.2'],
    2022: ['R/T 5.7', 'R/T ScatPack 6.4', 'R/T ScatPack WideBody 6.4', 'SRT HellCat 6.2', 'SRT HellCat WideBody 6.2', 'SRT HellCat RedEye 6.2', 'SRT HellCat RedEye WideBody 6.2', 'SRT HellCat RedEye SuperStock 6.2'],
    2023: ['R/T 5.7', 'R/T ScatPack 6.4', 'R/T ScatPack WideBody 6.4', 'SRT HellCat 6.2', 'SRT HellCat WideBody 6.2', 'SRT HellCat RedEye 6.2', 'SRT HellCat RedEye WideBody 6.2', 'SRT HellCat RedEye SuperStock 6.2', 'SRT Demon 170 6.2'],
    2024: ['R/T 5.7', 'R/T ScatPack 6.4', 'R/T ScatPack WideBody 6.4', 'SRT HellCat 6.2', 'SRT HellCat WideBody 6.2', 'SRT HellCat RedEye 6.2', 'SRT HellCat RedEye WideBody 6.2'],
  },
  CHARGER: {
    2018: ['R/T 5.7', 'ScatPack 6.4', 'SRT 392 6.4', 'SRT HellCat 6.2'],
    2019: ['R/T 5.7', 'ScatPack 6.4', 'ScatPack WideBody 6.4', 'SRT HellCat 6.2', 'SRT HellCat RedEye 6.2', 'SRT HellCat RedEye WideBody 6.2'],
    2020: ['R/T 5.7', 'ScatPack 6.4', 'ScatPack WideBody 6.4', 'SRT HellCat 6.2', 'SRT HellCat WideBody 6.2', 'SRT HellCat RedEye 6.2', 'SRT HellCat RedEye WideBody 6.2'],
    2021: ['R/T 5.7', 'ScatPack 6.4', 'ScatPack WideBody 6.4', 'SRT HellCat 6.2', 'SRT HellCat WideBody 6.2', 'SRT HellCat RedEye 6.2', 'SRT HellCat RedEye WideBody 6.2'],
    2022: ['R/T 5.7', 'ScatPack 6.4', 'ScatPack WideBody 6.4', 'SRT HellCat 6.2', 'SRT HellCat WideBody 6.2', 'SRT HellCat RedEye 6.2', 'SRT HellCat RedEye WideBody 6.2'],
    2023: ['R/T 5.7', 'ScatPack 6.4', 'ScatPack WideBody 6.4', 'SRT HellCat 6.2', 'SRT HellCat WideBody 6.2', 'SRT HellCat RedEye 6.2', 'SRT HellCat RedEye WideBody 6.2'],
    2024: ['R/T 5.7', 'ScatPack 6.4', 'ScatPack WideBody 6.4', 'SRT HellCat 6.2', 'SRT HellCat WideBody 6.2', 'SRT HellCat RedEye 6.2', 'SRT HellCat RedEye WideBody 6.2'],
  },
  DURANGO: {
    2021: ['SRT HellCat 6.2'],
    2023: ['SRT HellCat 6.2'],
    2024: ['SRT HellCat 6.2'],
    2025: ['SRT HellCat 6.2', 'SRT HellCat Silver Bullet 6.2', 'SRT HellCat Hammerhead 6.2', 'SRT HellCat Brass Monkey 6.2'],
    2026: ['SRT HellCat 6.2', 'SRT HellCat Jailbreak 6.2'],
  },
  CAMARO: {
    2016: ['SS 6.2', 'SS 1LE 6.2', 'ZL1 6.2'],
    2017: ['SS 6.2', 'SS 1LE 6.2', 'ZL1 6.2', 'ZL1 1LE 6.2'],
    2018: ['SS 6.2', 'SS 1LE 6.2', 'ZL1 6.2', 'ZL1 1LE 6.2'],
    2019: ['LT1 6.2', 'SS 6.2', 'SS 1LE 6.2', 'ZL1 6.2', 'ZL1 1LE 6.2'],
    2020: ['LT1 6.2', 'SS 6.2', 'SS 1LE 6.2', 'ZL1 6.2', 'ZL1 1LE 6.2'],
    2021: ['LT1 6.2', 'SS 6.2', 'SS 1LE 6.2', 'ZL1 6.2', 'ZL1 1LE 6.2'],
    2022: ['LT1 6.2', 'SS 6.2', 'SS 1LE 6.2', 'ZL1 6.2', 'ZL1 1LE 6.2'],
    2023: ['LT1 6.2', 'SS 6.2', 'SS 1LE 6.2', 'ZL1 6.2', 'ZL1 1LE 6.2'],
    2024: ['LT1 6.2', 'SS 6.2', 'SS 1LE 6.2', 'ZL1 6.2', 'ZL1 1LE 6.2', 'Panther Collector Edition LT1 6.2', 'Panther Collector Edition SS 6.2', 'Panther Collector Edition ZL1 6.2'],
  },
  CORVETTE: {
    2014: ['Stingray 6.2'], 2015: ['Stingray 6.2', 'Z06 6.2'], 2016: ['Stingray 6.2', 'Z06 6.2'],
    2017: ['Stingray 6.2', 'Grand Sport 6.2', 'Z06 6.2'], 2018: ['Stingray 6.2', 'Grand Sport 6.2', 'Z06 6.2'],
    2019: ['Stingray 6.2', 'Grand Sport 6.2', 'Z06 6.2', 'ZR1 6.2'], 2020: ['Stingray 6.2'],
    2021: ['Stingray 6.2'], 2022: ['Stingray 6.2'],
    2023: ['Stingray 6.2', 'Z06 5.5', '70th Anniversary Stingray 6.2', '70th Anniversary Z06 5.5'],
    2024: ['Stingray 6.2', 'Z06 5.5', 'E-Ray 6.2'],
    2025: ['Stingray 6.2', 'Z06 5.5', 'E-Ray 6.2', 'ZR1 5.5TT'],
    2026: ['Stingray 6.2', 'Z06 5.5', 'E-Ray 6.2', 'ZR1 5.5TT'],
  },
  '1500': {
    2009: ['1500 5.7'], 2010: ['1500 5.7'], 2011: ['1500 5.7'], 2012: ['1500 5.7'], 2013: ['1500 5.7'],
    2014: ['1500 5.7'], 2015: ['1500 5.7', '1500 Rebel 5.7'], 2016: ['1500 5.7', '1500 Rebel 5.7'],
    2017: ['1500 5.7', '1500 Rebel 5.7'], 2018: ['1500 5.7', '1500 Rebel 5.7'],
  },
  F150: {
    2017: ['SuperSnake 5.0L SC'], 2018: ['SuperSnake 5.0L SC'], 2019: ['SuperSnake 5.0L SC'],
    2020: ['SuperSnake 5.0L SC'], 2021: ['SuperSnake 5.0L SC'], 2022: ['SuperSnake 5.0L SC'],
    2023: ['SuperSnake 5.0L SC'], 2024: ['SuperSnake 5.0L SC'],
  },
}

export const specialEditions: Record<string, string[]> = {
  '2019-CHALLENGER-R/T ScatPack 6.4': ['None', '1320'],
  '2023-CHALLENGER-R/T ScatPack 6.4': ['None', 'Swinger', 'Shakedown', 'Mopar Edition', 'T/A', 'Shaker'],
  '2023-CHALLENGER-R/T ScatPack WideBody 6.4': ['None', 'Swinger', 'Shakedown', 'Mopar Edition', 'T/A', 'Shaker'],
  '2023-CHALLENGER-SRT HellCat 6.2': ['None', 'Black Ghost', 'Jailbreak'],
  '2023-CHALLENGER-SRT HellCat WideBody 6.2': ['None', 'Black Ghost', 'Jailbreak'],
  '2023-CHALLENGER-SRT HellCat RedEye 6.2': ['None', 'Jailbreak'],
  '2023-CHALLENGER-SRT HellCat RedEye WideBody 6.2': ['None', 'Jailbreak'],
  '2023-CHARGER-ScatPack 6.4': ['None', 'Super Bee'],
  '2023-CHARGER-ScatPack WideBody 6.4': ['None', 'Super Bee'],
  '2023-CHARGER-SRT HellCat RedEye 6.2': ['None', 'King Daytona', 'Daytona', 'Jailbreak'],
  '2023-CHARGER-SRT HellCat RedEye WideBody 6.2': ['None', 'King Daytona', 'Daytona', 'Jailbreak'],
}

const moparColors = ['B5 Blue', 'Destroyer Gray', 'F8 Green', 'Frostbite', 'Go Mango', 'Granite', 'Octane Red', 'Pitch Black', 'Plum Crazy', 'Sinamon Stick', 'Sublime', 'TorRed', 'Triple Nickel', 'White Knuckle']
const ramColors = ['Black', 'Bright White', 'Brilliant Black Crystal', 'Bright Silver Metallic', 'Deep Cherry Red Crystal', 'Maximum Steel Metallic', 'Granite Crystal Metallic', 'True Blue Pearl', 'Western Brown', 'Flame Red']
const camaroColors = ['Black', 'Summit White', 'Red Hot', 'Riverside Blue', 'Rapid Blue', 'Shadow Gray', 'Sharkskin', 'Vivid Orange', 'Wild Cherry', 'Radiant Red', 'Panther Matte Black']
const corvetteColors = ['Accelerate Yellow', 'Arctic White', 'Black', 'Ceramic Matrix Gray', 'Elkhart Lake Blue', 'Hypersonic Gray', 'Rapid Blue', 'Red Mist', 'Sea Wolf Gray', 'Silver Flare', 'Torch Red', 'White Pearl']
const fordColors = ['Agate Black', 'Oxford White', 'Star White', 'Rapid Red', 'Antimatter Blue', 'Atlas Blue', 'Carbonized Gray', 'Iconic Silver', 'Velocity Blue', 'Lead Foot', 'Magma Red', 'Shadow Black']
const durangoColors = ['Billet Silver', 'DB Black', 'Destroyer Gray', 'F8 Green', 'Granite Crystal', 'In-Violet', 'Octane Red', 'Reactor Blue', 'Redline', 'Vice White', 'White Knuckle']
const durangoColors2026 = ['Destroyer Gray', 'Diamond Black', 'Octane Red', 'Vapor Gray', 'White Knuckle']
const durangoColors2026Jailbreak = ['Destroyer Gray', 'Diamond Black', 'Green Machine', 'Octane Red', 'Vapor Gray', 'White Knuckle']

const colorsByConfiguration: Record<string, string[]> = {
  '2023-CHALLENGER-R/T ScatPack 6.4-Swinger': ['Sublime', 'F8 Green', 'White Knuckle'],
  '2023-CHALLENGER-R/T ScatPack WideBody 6.4-Swinger': ['Sublime', 'F8 Green', 'White Knuckle'],
  '2023-CHARGER-SRT HellCat RedEye 6.2-King Daytona': ['Go Mango'],
  '2023-CHARGER-SRT HellCat RedEye WideBody 6.2-King Daytona': ['Go Mango'],
  '2024-CAMARO-Panther Collector Edition LT1 6.2-None': ['Panther Matte Black'],
  '2024-CAMARO-Panther Collector Edition SS 6.2-None': ['Panther Matte Black'],
  '2024-CAMARO-Panther Collector Edition ZL1 6.2-None': ['Panther Matte Black'],
  '2025-DURANGO-SRT HellCat Silver Bullet 6.2-None': ['Triple Nickel'],
  '2025-DURANGO-SRT HellCat Hammerhead 6.2-None': ['Hammerhead Gray'],
  '2025-DURANGO-SRT HellCat Brass Monkey 6.2-None': ['Red Oxide'],
  '2026-DURANGO-SRT HellCat 6.2-None': durangoColors2026,
  '2026-DURANGO-SRT HellCat Jailbreak 6.2-None': durangoColors2026Jailbreak,
}

export function getAvailableColors(year: number, brand: string, model: string, version: string, specialEdition: string): string[] {
  const key = `${year}-${model}-${version}-${specialEdition}`
  if (colorsByConfiguration[key]) return colorsByConfiguration[key]
  if (model === 'DURANGO' && year === 2026) return durangoColors2026
  if (model === 'DURANGO') return durangoColors
  if (brand === 'RAM') return ramColors
  if (model === 'CAMARO') return camaroColors
  if (model === 'CORVETTE') return corvetteColors
  if (brand === 'FORD') return fordColors
  return moparColors
}