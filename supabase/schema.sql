-- ==============================================================================
-- DPS INDIRAPURAM TECH & INNOVATION EXHIBITION (DPSI)
-- Production Supabase SQL Schema & Anti-Cheat Voting Architecture
-- ==============================================================================

-- 1. Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Clean teardown for fresh migrations (optional during setup)
DROP TRIGGER IF EXISTS trg_increment_project_vote ON public.votes;
DROP FUNCTION IF EXISTS public.handle_new_vote();
DROP TABLE IF EXISTS public.votes;
DROP TABLE IF EXISTS public.projects;

-- 3. Projects Table
CREATE TABLE public.projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    zone TEXT NOT NULL CHECK (zone IN ('zone-1', 'zone-2', 'zone-3')),
    category TEXT NOT NULL CHECK (category IN ('Show & Tell', 'Physical', 'Digital', 'Business', 'Robo Race', 'Robo Soccer')),
    booth_number INTEGER NOT NULL UNIQUE,
    position_x REAL NOT NULL,
    position_y REAL NOT NULL DEFAULT 0.0,
    position_z REAL NOT NULL,
    image_url TEXT NOT NULL,
    description TEXT NOT NULL,
    members TEXT[] NOT NULL DEFAULT '{}',
    vote_count INTEGER NOT NULL DEFAULT 0 CHECK (vote_count >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexing for high-concurrency leaderboard queries and zone filtering
CREATE INDEX idx_projects_zone ON public.projects(zone);
CREATE INDEX idx_projects_category ON public.projects(category);
CREATE INDEX idx_projects_vote_count ON public.projects(vote_count DESC);

-- 4. Votes Table (4-Layer Anti-Cheat & Composite Constraints)
CREATE TABLE public.votes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    device_fingerprint TEXT NOT NULL,
    ip_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Layer 2: One vote per authenticated user per project
    CONSTRAINT uq_user_project UNIQUE (user_id, project_id),

    -- Layer 3: Hardware device fingerprint protection
    CONSTRAINT uq_device_project UNIQUE (device_fingerprint, project_id)
);

CREATE INDEX idx_votes_project_id ON public.votes(project_id);
CREATE INDEX idx_votes_user_id ON public.votes(user_id);
CREATE INDEX idx_votes_device_fingerprint ON public.votes(device_fingerprint);

-- 5. Atomic Vote Increment Trigger (Layer 4 Security Definer)
-- Ensures clients can never directly tamper with project vote counts
CREATE OR REPLACE FUNCTION public.handle_new_vote()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    UPDATE public.projects
    SET vote_count = vote_count + 1
    WHERE id = NEW.project_id;
    RETURN NEW;
END;
$$;

CREATE TRIGGER trg_increment_project_vote
AFTER INSERT ON public.votes
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_vote();

-- 6. Row Level Security (RLS) Configuration
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;

-- Anyone can view projects (Public Exhibition View)
CREATE POLICY "Public Read Projects"
ON public.projects
FOR SELECT
TO public
USING (true);

-- Only authenticated users or service role can insert verified votes
CREATE POLICY "Authenticated Insert Vote"
ON public.votes
FOR INSERT
TO authenticated
WITH CHECK (
    auth.uid() = user_id
);

-- Users can see which projects they have already voted for
CREATE POLICY "Users Select Own Votes"
ON public.votes
FOR SELECT
TO authenticated
USING (
    auth.uid() = user_id
);

-- 7. Enable Supabase Realtime for Projects Live Leaderboard
ALTER PUBLICATION supabase_realtime ADD TABLE public.projects;

-- ==============================================================================
-- INITIAL SEED SCRIPT (Runs automatically to initialize exhibition booths)
-- ==============================================================================
INSERT INTO public.projects (id, title, zone, category, booth_number, position_x, position_y, position_z, image_url, description, members, vote_count)
VALUES
  -- Zone 1: Show & Tell
  ('a0000001-0000-0000-0000-000000000001', 'AeroClean: Drone Air Purifier', 'zone-1', 'Show & Tell', 101, -36, 0, -12, 'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=800&q=80', 'Autonomous quadcopter drone equipped with electrostatic precipitation filters and PM2.5/PM10 sensors to purify localized air in sports complexes.', ARRAY['Aarav Sharma (XII-A)', 'Ananya Gupta (XI-B)', 'Devansh Dixit (XII-C)'], 84),
  ('a0000001-0000-0000-0000-000000000002', 'HoloLearn: AR Classroom Cube', 'zone-1', 'Show & Tell', 102, -42, 0, -7, 'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&w=800&q=80', 'Interactive optical holographic prism cube coupled with leap motion gesture control to rotate and dissect 3D biological models.', ARRAY['Rohan Verma (X-A)', 'Sneha Nambiar (X-D)'], 73),
  ('a0000001-0000-0000-0000-000000000003', 'NeuroVibe: BCI Music Synthesizer', 'zone-1', 'Show & Tell', 103, -45, 0, 0, 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&w=800&q=80', 'Brain-computer interface headband decoding EEG alpha/beta wave ratios to generate meditative ambient soundscapes that lower exam anxiety.', ARRAY['Kabir Malhotra (XII-B)', 'Ishaan Saxena (XII-B)'], 91),
  ('a0000001-0000-0000-0000-000000000004', 'SmartHydro: Vertical Algae Bio-Wall', 'zone-1', 'Show & Tell', 104, -42, 0, 7, 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80', 'Modular microalgae photobioreactor wall sequestering CO2 10x faster than plants while illuminating corridors with bioluminescence.', ARRAY['Pooja Sundaram (XI-E)', 'Aditi Chawla (XI-A)', 'Meera Nair (X-C)'], 65),
  ('a0000001-0000-0000-0000-000000000005', 'TactileSight: Ultrasonic Haptic Glove', 'zone-1', 'Show & Tell', 105, -36, 0, 12, 'https://images.unsplash.com/photo-1589254065878-42c9da997008?auto=format&fit=crop&w=800&q=80', 'Wearable assistive sensory glove mapping depth camera point-clouds into frequency-modulated fingertip vibrations for the visually impaired.', ARRAY['Siddharth Rao (XII-D)', 'Tanvi Deshmukh (XII-A)'], 88),
  ('a0000001-0000-0000-0000-000000000006', 'SolarTrack: Dual-Axis Biomimetic Tree', 'zone-1', 'Show & Tell', 106, -30, 0, 0, 'https://images.unsplash.com/photo-1508873696983-2df5293cb32b?auto=format&fit=crop&w=800&q=80', 'Sunflower-inspired solar tree with dual-axis LDR tracking and peristaltic water cleaning boosting energy yield by 34%.', ARRAY['Aryan Vats (XI-C)', 'Kunal Singhal (XI-C)'], 57),

  -- Zone 2: Aisle A (Physical)
  ('a0000002-0000-0000-0000-000000000001', 'AgriSense: Soil Spectroscopy Probe', 'zone-2', 'Physical', 201, -12, 0, -18, 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&w=800&q=80', 'Portable optical spectroscopy handheld device measuring nitrogen, phosphorus, and potassium ratios in 10s.', ARRAY['Arjun Batra (XII-A)', 'Shreya Kapoor (XI-B)'], 42),
  ('a0000002-0000-0000-0000-000000000002', 'PiezoWalk: Kinetic Campus Flooring', 'zone-2', 'Physical', 202, -12, 0, -14, 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=800&q=80', 'Interlocking sub-floor tiles utilizing lead-free piezoelectric cantilevers that harvest pedestrian steps to illuminate emergency lighting.', ARRAY['Vihaan Mathur (XI-F)', 'Ritvik Garg (XI-F)'], 36),
  ('a0000002-0000-0000-0000-000000000003', 'AquaCycle: Greywater Membrane Sieve', 'zone-2', 'Physical', 203, -12, 0, -10, 'https://images.unsplash.com/photo-1544377193-33dcf4d68fb5?auto=format&fit=crop&w=800&q=80', 'Compact under-sink filtration unit with gravity ceramic membrane and UV-C LED sterilization for reusing washbasin water.', ARRAY['Diya Aggarwal (XII-E)', 'Kavya Tandon (XII-E)'], 51),
  ('a0000002-0000-0000-0000-000000000004', 'ThermaSave: Phase Change Roof Tiles', 'zone-2', 'Physical', 204, -12, 0, -6, 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80', 'Passive cooling roof tiles infused with bio-based paraffin phase change materials that absorb peak summer solar radiation.', ARRAY['Pranav Joshi (X-B)', 'Eshan Rastogi (X-B)'], 29),
  ('a0000002-0000-0000-0000-000000000005', 'ExoGrip: Soft Pneumatic Rehab Glove', 'zone-2', 'Physical', 205, -12, 0, -2, 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80', 'Silicone elastomer pneumatic bladder actuators assisting stroke recovery patients with bio-mimetic muscle compliance.', ARRAY['Manav Khurana (XII-C)', 'Sia Sethi (XII-C)'], 67),
  ('a0000002-0000-0000-0000-000000000006', 'PureBreath: Smart Anti-Pollution Mask', 'zone-2', 'Physical', 206, -12, 0, 2, 'https://images.unsplash.com/photo-1584634731339-252c581abfc5?auto=format&fit=crop&w=800&q=80', 'Active micro-turbine ventilator mask with HEPA-13 active filtration, dynamic breathing-rate sensing, and BLE telemetry.', ARRAY['Harsh Vardhan (XI-D)', 'Navya Goel (XI-D)'], 38),
  ('a0000002-0000-0000-0000-000000000007', 'BioPlastic: Potato Starch Packaging', 'zone-2', 'Physical', 207, -12, 0, 6, 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80', 'Water-soluble, food-safe packaging films formulated from discarded culinary potato peel starches that biodegrade in 21 days.', ARRAY['Rhea Chawla (X-E)', 'Gaurav Jain (X-E)'], 45),
  ('a0000002-0000-0000-0000-000000000008', 'SafeCylinder: IoT Gas Leak Interrupter', 'zone-2', 'Physical', 208, -12, 0, 10, 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80', 'Automatic mechanical ball-valve clamp that instantly shuts LPG cylinders upon detecting methane or butane leaks.', ARRAY['Samar Pratap (XI-A)', 'Kartik Mohan (XI-A)'], 53),
  ('a0000002-0000-0000-0000-000000000009', 'AeroFoil: Micro-Wind Turbine Chimney', 'zone-2', 'Physical', 209, -12, 0, 14, 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=800&q=80', 'Omnidirectional vertical axis wind turbine housed inside a venturi cowl that trickle-charges perimeter security devices.', ARRAY['Dhruv Nanda (XII-D)', 'Aarushi Sehgal (XII-D)'], 31),
  ('a0000002-0000-0000-0000-000000000010', 'BraillePad: Refreshable Tactile Slate', 'zone-2', 'Physical', 210, -12, 0, 18, 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80', 'Affordable single-line refreshable braille display built with micro-solenoids for reading digital textbooks.', ARRAY['Pratyush Soni (XII-B)', 'Devina Roy (XII-B)'], 62),

  -- Zone 2: Aisle B (Digital)
  ('a0000002-0000-0000-0000-000000000011', 'NeuroClass: AI Attention & Focus Tracker', 'zone-2', 'Digital', 211, 0, 0, -18, 'https://images.unsplash.com/photo-1507146426996-ef05306b995a?auto=format&fit=crop&w=800&q=80', 'On-device vision pipeline estimating classroom engagement from head-pose and gaze without saving personal faces.', ARRAY['Shaurya Mittal (XII-A)', 'Aditya Bhatt (XII-A)'], 79),
  ('a0000002-0000-0000-0000-000000000012', 'DPSI-Vault: Zero-Knowledge Student Records', 'zone-2', 'Digital', 212, 0, 0, -14, 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80', 'Decentralized verifiable credentials platform allowing alumni to cryptographically prove report cards with zk-SNARKs.', ARRAY['Tanishk Bansal (XII-F)', 'Raghav Anand (XI-A)'], 58),
  ('a0000002-0000-0000-0000-000000000013', 'EcoRoute: Green Commute Multi-Modal Planner', 'zone-2', 'Digital', 213, 0, 0, -10, 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80', 'Routing engine combining metro and electric bus schedules to compute lowest CO2 commute paths in Delhi NCR.', ARRAY['Anirudh Iyer (XI-B)', 'Varun Chopra (XI-B)'], 47),
  ('a0000002-0000-0000-0000-000000000014', 'SignBridge: Real-Time ISL to Speech AI', 'zone-2', 'Digital', 214, 0, 0, -6, 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80', 'Browser-based transformer translating Indian Sign Language gestures into synthesized speech at 60 FPS in real time.', ARRAY['Mehul Khandelwal (XII-C)', 'Aarushi Jain (XII-C)'], 86),
  ('a0000002-0000-0000-0000-000000000015', 'CodeSentry: Vulnerability Scanner for Students', 'zone-2', 'Digital', 215, 0, 0, -2, 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80', 'Interactive SAST security linter for student coders, catching injection flaws, secrets, and memory safety leaks.', ARRAY['Rishi Narang (XI-E)', 'Udayan Sen (XI-E)'], 49),
  ('a0000002-0000-0000-0000-000000000016', 'MediVision: Retinal Diabetic AI Screening', 'zone-2', 'Digital', 216, 0, 0, 2, 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80', 'Lightweight vision transformer detecting micro-aneurysms in fundus images taken with 3D-printed phone adapters.', ARRAY['Drishya Pillai (XII-E)', 'Naman Seth (XII-E)'], 94),
  ('a0000002-0000-0000-0000-000000000017', 'AuditFlow: Algorithmic Fairness Assessor', 'zone-2', 'Digital', 217, 0, 0, 6, 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80', 'Interactive dashboard evaluating demographic parity and equalized odds in ML classification models before launch.', ARRAY['Kushagra Saxena (XI-C)', 'Ira Singhania (XI-C)'], 39),
  ('a0000002-0000-0000-0000-000000000018', 'AgroDroneOS: Satellite Crop Stress Indexing', 'zone-2', 'Digital', 218, 0, 0, 10, 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80', 'Cloud platform processing Sentinel-2 satellite imagery to alert farmers about nitrogen stress via automated WhatsApp.', ARRAY['Tejas Mathur (XII-B)', 'Prisha Mehra (XII-B)'], 61),
  ('a0000002-0000-0000-0000-000000000019', 'SoundScape: Spatial Audio for ADHD Students', 'zone-2', 'Digital', 219, 0, 0, 14, 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80', 'Dynamic 3D binaural noise generator masking acoustic distractions for students with neurodivergent sensory needs.', ARRAY['Aviral Jain (X-A)', 'Simran Bajaj (X-A)'], 52),
  ('a0000002-0000-0000-0000-000000000020', 'FactShield: Deepfake & Misinformation Flag', 'zone-2', 'Digital', 220, 0, 0, 18, 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80', 'Extension analyzing social media videos for spectral frequency anomalies to warn users of AI generated deepfakes.', ARRAY['Akshat Taneja (XII-D)', 'Saanvi Malhotra (XII-D)'], 76),

  -- Zone 2: Aisle C (Business)
  ('a0000002-0000-0000-0000-000000000021', 'Kits4Kids: STEM Science DIY Subscription', 'zone-2', 'Business', 221, 12, 0, -18, 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80', 'Subscription box service offering tactile hands-on STEM kits manufactured from reclaimed school science equipment.', ARRAY['Yashvardhan Roy (XII-A)', 'Bhavya Grover (XII-A)'], 55),
  ('a0000002-0000-0000-0000-000000000022', 'UpCloth: Upcycled Uniform Fashion Brand', 'zone-2', 'Business', 222, 12, 0, -14, 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=800&q=80', 'Circular fashion brand transforming old school uniforms into durable laptop sleeves and eco accessories.', ARRAY['Khushi Juneja (XI-D)', 'Palak Sharma (XI-D)'], 48),
  ('a0000002-0000-0000-0000-000000000023', 'CaféWaste: Campus Compost to Fertilizer', 'zone-2', 'Business', 223, 12, 0, -10, 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80', 'Micro-composting initiative processing cafeteria scraps into organic bio-fertilizer pellets for regional horticulturists.', ARRAY['Rudra Pratap (XI-C)', 'Samaira Chadha (XI-C)'], 63),
  ('a0000002-0000-0000-0000-000000000024', 'Rent-A-Tool: High-End Lab Equipment Co-op', 'zone-2', 'Business', 224, 12, 0, -6, 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80', 'Collaborative asset exchange allowing nearby schools to share high-cost lab apparatus like oscilloscopes and spectrophotometers.', ARRAY['Harshit Bajaj (XII-C)', 'Pranit Oberoi (XII-C)'], 37),
  ('a0000002-0000-0000-0000-000000000025', 'PeerTutor: Micro-Mentorship & Credits', 'zone-2', 'Business', 225, 12, 0, -2, 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80', 'Student marketplace where senior mentors provide exam preparation in exchange for university portfolio endorsements.', ARRAY['Tanay Agarwal (XI-A)', 'Lavanya Mittal (XI-A)'], 69),
  ('a0000002-0000-0000-0000-000000000026', 'SunBite: Solar Dehydrated Fruit Snacks', 'zone-2', 'Business', 226, 12, 0, 2, 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?auto=format&fit=crop&w=800&q=80', 'Solar thermal dehydration producing preservative-free fruit slices from regional mandi produce to prevent food loss.', ARRAY['Siya Bhasin (X-C)', 'Aryavart Kashyap (X-C)'], 44),
  ('a0000002-0000-0000-0000-000000000027', 'CarbonFoot: Hyperlocal Green Rewards', 'zone-2', 'Business', 227, 12, 0, 6, 'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?auto=format&fit=crop&w=800&q=80', 'Incentive mobile program rewarding students who walk or bike to school with partner discounts at local shops.', ARRAY['Chaitanya Ahuja (XII-B)', 'Devishi Puri (XII-B)'], 59),
  ('a0000002-0000-0000-0000-000000000028', 'EchoPrint: 100% Recycled Filament Lab', 'zone-2', 'Business', 228, 12, 0, 10, 'https://images.unsplash.com/photo-1616401784845-180882ba9ba8?auto=format&fit=crop&w=800&q=80', 'Campus micro-venture converting discarded plastic bottles into certified 1.75mm 3D printing filament.', ARRAY['Nikhil Rastogi (XII-F)', 'Rehaan Siddiqui (XII-F)'], 72),
  ('a0000002-0000-0000-0000-000000000029', 'BookLoop: Algorithmic Textbook Exchange', 'zone-2', 'Business', 229, 12, 0, 14, 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80', 'Graph matching algorithm recirculating syllabus books to incoming classes at nominal rental fees.', ARRAY['Aastha Monga (XI-E)', 'Vansh Sethi (XI-E)'], 50),
  ('a0000002-0000-0000-0000-000000000030', 'SmartSticker: Dynamic NFC Locker Keys', 'zone-2', 'Business', 230, 12, 0, 18, 'https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&w=800&q=80', 'Encrypted NFC tags upgrading mechanical lockers into touchless smartphone-activated smart lockers.', ARRAY['Raghav Singhal (XI-B)', 'Aditi Mishra (XI-B)'], 41),

  -- Zone 3: Robotics Arena
  ('a0000003-0000-0000-0000-000000000001', 'Velocity Prime: Line-Maze Racer', 'zone-3', 'Robo Race', 301, 32, 0, -16, 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80', 'Ultra-low center of gravity chassis with carbon-fiber winglets and 8-channel optical array tuned via PID.', ARRAY['Kushagra Tyagi (XII-A)', 'Vivaan Sehgal (XII-A)', 'Daksh Jain (XI-C)'], 108),
  ('a0000003-0000-0000-0000-000000000002', 'Apex Drifter: Obstacle Racer', 'zone-3', 'Robo Race', 302, 44, 0, -16, 'https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&w=800&q=80', 'Monocular camera and edge TPU executing real-time segmentation to dodge dynamic obstacles on track.', ARRAY['Armaan Mehra (XII-B)', 'Zoya Farooqui (XII-B)'], 92),
  ('a0000003-0000-0000-0000-000000000003', 'NitroBot: All-Terrain Buggy', 'zone-3', 'Robo Race', 303, 32, 0, -4, 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80', 'Four-wheel independent suspension racer with planetary gearboxes conquering inclined obstacles.', ARRAY['Dhruv Grover (XI-A)', 'Siddhant Kapoor (XI-A)'], 85),
  ('a0000003-0000-0000-0000-000000000004', 'Vortex Vector: Magnetic Downforce', 'zone-3', 'Robo Race', 304, 44, 0, -4, 'https://images.unsplash.com/photo-1535378917042-10a22c95931a?auto=format&fit=crop&w=800&q=80', 'Neodymium magnetic skirts providing active track-vacuum suction for aggressive high-speed cornering.', ARRAY['Aryaman Seth (XII-F)', 'Vidur Roy (XII-F)'], 99),
  ('a0000003-0000-0000-0000-000000000005', 'Titan Striker: Omni-Drive Striker', 'zone-3', 'Robo Soccer', 305, 32, 0, 4, 'https://images.unsplash.com/photo-1508873696983-2df5293cb32b?auto=format&fit=crop&w=800&q=80', 'Three-wheel holonomic omni-drive robot with high-energy solenoid kicker launching 40 km/h strikes.', ARRAY['Shaurya Pratap Singh (XII-B)', 'Devansh Suri (XII-B)', 'Manan Kaul (XI-E)'], 115),
  ('a0000003-0000-0000-0000-000000000006', 'Aegis Keeper: Omni Goalkeeper', 'zone-3', 'Robo Soccer', 306, 44, 0, 4, 'https://images.unsplash.com/photo-1589254065878-42c9da997008?auto=format&fit=crop&w=800&q=80', 'Defensive keeper with ToF LiDAR range-finding and 4G lateral acceleration to intercept penalty shots.', ARRAY['Anirudh Taneja (XI-D)', 'Soham Banerjee (XI-D)'], 103),
  ('a0000003-0000-0000-0000-000000000007', 'Shadow Wing: Midfield Interceptor', 'zone-3', 'Robo Soccer', 307, 32, 0, 16, 'https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&w=800&q=80', 'Tactical playmaker with active backspin ball dribbler and peer-to-peer radio link for cross-passes.', ARRAY['Pranav Mahajan (XII-E)', 'Udit Wadhwa (XII-E)'], 90),
  ('a0000003-0000-0000-0000-000000000008', 'Cyber Dynamo: Heavyweight Defender', 'zone-3', 'Robo Soccer', 308, 44, 0, 16, 'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=800&q=80', 'Armored CNC aluminum chassis with high-torque brushless hub motors shielding the goalie goalmouth.', ARRAY['Tanveer Duggal (XII-C)', 'Kabir Bedi (XII-C)'], 82)
ON CONFLICT (booth_number) DO UPDATE
SET title = EXCLUDED.title,
    description = EXCLUDED.description,
    image_url = EXCLUDED.image_url,
    members = EXCLUDED.members,
    vote_count = EXCLUDED.vote_count;
