import re

layout = {
  # =========================================================
  # LEFT HORSESHOE CLUSTER (P01-P12, D01-D04)
  # Courtyard centered at X = -10.0, span X = -17.0 to -3.0
  # =========================================================

  # North Top Row: Z = -17.5, facing South (rot: 0.0)
  "P07": {"x": -14.5, "y": 0, "z": -17.5, "rot": 0.0},
  "P08": {"x": -11.5, "y": 0, "z": -17.5, "rot": 0.0},
  "P09": {"x": -8.5,  "y": 0, "z": -17.5, "rot": 0.0},
  "P10": {"x": -5.5,  "y": 0, "z": -17.5, "rot": 0.0},

  # West Column: X = -17.0, facing East (rot: 1.571 = +pi/2)
  "P06": {"x": -17.0, "y": 0, "z": -12.5, "rot": 1.571},
  "P05": {"x": -17.0, "y": 0, "z": -7.5,  "rot": 1.571},
  "P04": {"x": -17.0, "y": 0, "z": -2.5,  "rot": 1.571},
  "P03": {"x": -17.0, "y": 0, "z": 2.5,   "rot": 1.571},
  "P02": {"x": -17.0, "y": 0, "z": 7.5,   "rot": 1.571},
  "P01": {"x": -17.0, "y": 0, "z": 12.5,  "rot": 1.571},

  # East Column / Left Internal Column: X = -3.0, rotated 90 deg (rot: 0.0)
  # Horizontal desks facing South, chairs at North back
  "P11": {"x": -3.0,  "y": 0, "z": -12.5, "rot": 0.0},
  "P12": {"x": -3.0,  "y": 0, "z": -7.5,  "rot": 0.0},
  "D01": {"x": -3.0,  "y": 0, "z": -2.5,  "rot": 0.0},
  "D02": {"x": -3.0,  "y": 0, "z": 2.5,   "rot": 0.0},
  "D03": {"x": -3.0,  "y": 0, "z": 7.5,   "rot": 0.0},
  "D04": {"x": -3.0,  "y": 0, "z": 12.5,  "rot": 0.0},

  # =========================================================
  # RIGHT HORSESHOE CLUSTER (D05-D12, B01-B07)
  # Courtyard centered at X = +10.0, span X = +3.0 to +17.0
  # =========================================================

  # North Top Row: Z = -17.5, facing South (rot: 0.0)
  "D11": {"x": 5.5,   "y": 0, "z": -17.5, "rot": 0.0},
  "D12": {"x": 8.5,   "y": 0, "z": -17.5, "rot": 0.0},
  "B01": {"x": 11.5,  "y": 0, "z": -17.5, "rot": 0.0},
  "B02": {"x": 14.5,  "y": 0, "z": -17.5, "rot": 0.0},

  # West Column / Right Internal Column: X = 3.0, rotated 90 deg (rot: 0.0)
  # Horizontal desks facing South, chairs at North back
  "D10": {"x": 3.0,   "y": 0, "z": -12.5, "rot": 0.0},
  "D09": {"x": 3.0,   "y": 0, "z": -7.5,  "rot": 0.0},
  "D08": {"x": 3.0,   "y": 0, "z": -2.5,  "rot": 0.0},
  "D07": {"x": 3.0,   "y": 0, "z": 2.5,   "rot": 0.0},
  "D06": {"x": 3.0,   "y": 0, "z": 7.5,   "rot": 0.0},
  "D05": {"x": 3.0,   "y": 0, "z": 12.5,  "rot": 0.0},

  # East Column: X = 17.0, facing West (rot: -1.571 = -pi/2)
  "B03": {"x": 17.0,  "y": 0, "z": -7.5,  "rot": -1.571},
  "B04": {"x": 17.0,  "y": 0, "z": -2.5,  "rot": -1.571},
  "B05": {"x": 17.0,  "y": 0, "z": 2.5,   "rot": -1.571},
  "B06": {"x": 17.0,  "y": 0, "z": 7.5,   "rot": -1.571},
  "B07": {"x": 17.0,  "y": 0, "z": 12.5,  "rot": -1.571},

  # =========================================================
  # SHOW & TELL PAVILION (Dual Facing Rows along -0.24 rad corridor)
  # =========================================================
  "ST01": {"x": -36.85, "y": 0, "z": -5.23, "rot": 1.331},
  "ST02": {"x": -35.90, "y": 0, "z": -1.35, "rot": 1.331},
  "ST03": {"x": -34.95, "y": 0, "z": 2.54,  "rot": 1.331},
  "ST04": {"x": -34.00, "y": 0, "z": 6.42,  "rot": 1.331},

  "ST05": {"x": -32.00, "y": 0, "z": -6.42, "rot": -1.811},
  "ST06": {"x": -31.05, "y": 0, "z": -2.54, "rot": -1.811},
  "ST07": {"x": -30.10, "y": 0, "z": 1.35,  "rot": -1.811},
  "ST08": {"x": -29.15, "y": 0, "z": 5.23,  "rot": -1.811},

  # Robotics Arenas
  "R01": {"x": -14.0, "y": 0, "z": -34.0, "rot": 0.0},
  "R02": {"x": 14.0,  "y": 0, "z": -34.0, "rot": 0.0},
  "S01": {"x": -14.0, "y": 0, "z": -38.0, "rot": 0.0},
  "S02": {"x": 14.0,  "y": 0, "z": -38.0, "rot": 0.0},
}

with open("src/data/seedProjects.ts", "r") as f:
    text = f.read()

count = 0
for code, pos in layout.items():
    pattern = rf"(booth_code:\s*['\"]{code}['\"].*?position_x:\s*)[-\d.]+(\s*,\s*position_y:\s*)[-\d.]+(\s*,\s*position_z:\s*)[-\d.]+(?:,\s*rotation_y:\s*[-\d.]+)?(\s*,)"
    replacement = rf"\g<1>{pos['x']}\g<2>{pos['y']}\g<3>{pos['z']},\n    rotation_y: {pos['rot']}\g<4>"
    new_text, n = re.subn(pattern, replacement, text, count=1, flags=re.DOTALL)
    if n > 0:
        text = new_text
        count += n
    else:
        print("Not matched:", code)

print(f"Successfully updated {count} booth positions and rotations.")
with open("src/data/seedProjects.ts", "w") as f:
    f.write(text)
