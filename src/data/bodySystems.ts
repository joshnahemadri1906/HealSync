import { BodySystem } from '../types';

export const BODY_SYSTEMS: BodySystem[] = [
  {
    id: 'musculoskeletal',
    name: 'Musculoskeletal System',
    tamilName: 'தசை எலும்பு மண்டலம் (Musculoskeletal)',
    hindiName: 'मस्कुलोस्केलेटल प्रणाली (Musculoskeletal)',
    teluguName: 'కండరాల అస్థిపంజర వ్యవస్థ',
    iconName: 'Bone',
    whyItMatters: 'Bones, muscles, joints, ligaments and tendons; the core of physiotherapy.',
    commonConditions: ['Back pain', 'Arthritis', 'Fractures', 'Sports injuries', 'Tendonitis', 'Postural imbalances'],
    anatomicalParts: ['Spine & Vertebrae', 'Shoulder & Rotator Cuff', 'Knee Joint & Meniscus', 'Hip & Pelvic Girdle', 'Ankle & Achilles Tendon'],
    dietRecommendations: {
      title: 'Bone Mineral Density & Muscle Repair Nutrition',
      keyNutrients: ['Calcium', 'Vitamin D3 & K2', 'High-biological Value Protein', 'Magnesium', 'Omega-3 Fatty Acids'],
      foodsToEat: [
        'Calcium-rich dairy or ragi (finger millet), sesame seeds',
        'Lean proteins, lentils, paneer, eggs, soy chunks for myofibrillar repair',
        'Fatty fish or flaxseeds/chia seeds to suppress joint inflammation',
        'Dark leafy greens (spinach, drumstick leaves / murungai keerai) rich in magnesium'
      ],
      foodsToAvoid: [
        'Excess refined sugar & trans fats (stimulate systemic inflammation and joint aches)',
        'Excessive sodium/salt (accelerates urinary calcium loss)',
        'Carbonated sodas with phosphoric acid'
      ],
      dailyHydrationTip: 'Drink at least 2.5 to 3 Litres of water daily; articular cartilage in joints is 80% water and requires hydration to prevent friction.',
      clinicalRationale: 'Adequate protein synthesis prevents sarcopenia (muscle loss), while vitamin D-mediated calcium absorption maintains cortical bone strength around vulnerable joints.'
    },
    rehabilitationExercises: [
      {
        name: 'Lumbar Pelvic Tilts & Cat-Cow Mobilization',
        targetMuscleOrJoint: 'Lumbar Spine & Core Stabilizers',
        reps: '10 to 12 slow repetitions',
        frequency: '2 times daily (morning & before bed)',
        instructions: [
          'Lie on your back with knees bent and feet flat on the floor (or on all fours).',
          'Gently contract your abdominal muscles to flatten your lower back against the mat.',
          'Hold for 3-5 seconds while breathing smoothly, then release into a neutral spine.'
        ],
        precautions: 'Do not hold your breath or arch your back forcefully. Stop if sharp radiating nerve pain occurs.',
        difficulty: 'Gentle / Beginner'
      },
      {
        name: 'Isometric Quadriceps & Straight Leg Raise',
        targetMuscleOrJoint: 'Quadriceps Femoris & Patellar Tracking',
        reps: '3 sets of 10 repetitions per leg',
        frequency: 'Once daily',
        instructions: [
          'Lie flat. Place a rolled small towel under the knee.',
          'Tighten your front thigh muscles, pressing the knee gently into the towel.',
          'Lift your leg 20 cm off the floor keeping the knee straight. Hold for 5 seconds and slowly lower.'
        ],
        precautions: 'Avoid lifting past 30 degrees to minimize lumbar strain.',
        difficulty: 'Gentle / Beginner'
      },
      {
        name: 'Thoracic Extension & Scapular Squeezes',
        targetMuscleOrJoint: 'Rhomboids, Middle Trapezius & Postural Chain',
        reps: '15 repetitions with 5-second hold',
        frequency: 'Every 2 hours during desk sitting',
        instructions: [
          'Sit tall with shoulders relaxed away from ears.',
          'Draw your shoulder blades backward and downward as if pinching a pencil between them.',
          'Open your chest and breathe deeply without straining the neck.'
        ],
        precautions: 'Keep chin tucked; do not thrust neck forward.',
        difficulty: 'Gentle / Beginner'
      }
    ],
    interactiveHotspots: [
      { part: 'Cervical & Upper Spine', x: 50, y: 18, description: 'Supports head weight and neck mobility; susceptible to forward-head posture.' },
      { part: 'Shoulder Complex', x: 32, y: 24, description: 'Ball-and-socket joint prone to rotator cuff tears and adhesive capsulitis (frozen shoulder).' },
      { part: 'Lumbar Spine & Core', x: 50, y: 44, description: 'Primary load-bearing axis; critical site for disc rehabilitation and posture.' },
      { part: 'Knees & Hinge Joints', x: 42, y: 72, description: 'Bears up to 4x body weight during stair climbing; key focus for osteoarthritis therapy.' }
    ]
  },
  {
    id: 'nervous',
    name: 'Nervous System',
    tamilName: 'நரம்பு மண்டலம் (Nervous System)',
    hindiName: 'तंत्रिका तंत्र (Nervous System)',
    teluguName: 'నాడీ వ్యవస్థ',
    iconName: 'Brain',
    whyItMatters: 'Controls movement, sensation, balance and coordination.',
    commonConditions: ['Stroke recovery', 'Spinal cord injury', 'Parkinson\'s disease', 'Nerve injuries (Sciatica, Carpal Tunnel)', 'Neuropathy'],
    anatomicalParts: ['Brain & Motor Cortex', 'Spinal Cord Axis', 'Sciatic Nerve Pathway', 'Peripheral Sensory Nerves'],
    dietRecommendations: {
      title: 'Neuro-Protection & Myelin Sheath Regeneration Diet',
      keyNutrients: ['Vitamin B12 & B-Complex', 'Docosahexaenoic Acid (DHA / Omega-3)', 'Choline', 'Antioxidants (Alpha Lipoic Acid)'],
      foodsToEat: [
        'Walnuts, chia seeds, fortified cereals for myelin protection',
        'Eggs, avocados, and legumes rich in choline (precursor to acetylcholine for nerve transmission)',
        'Deeply colored berries (blueberries, amla / Indian gooseberry) packed with polyphenols',
        'Curcumin (turmeric) with black pepper to downregulate neuro-inflammation'
      ],
      foodsToAvoid: [
        'High glycemic sweets (chronic high glucose damages peripheral nerve micro-vessels)',
        'Excessive alcohol (toxic to neural pathways and peripheral myelin)'
      ],
      dailyHydrationTip: 'The brain is ~75% water. Mild dehydration drops motor processing speed and increases nerve sensitivity.',
      clinicalRationale: 'Neuroplasticity relies on adequate metabolic energy and neuro-protective antioxidants to forge new motor pathways during rehabilitation.'
    },
    rehabilitationExercises: [
      {
        name: 'Tandem Stance & Proprioceptive Balancing',
        targetMuscleOrJoint: 'Somatosensory Pathways & Balance Centers',
        reps: '3 sets of 20-30 second holds each foot forward',
        frequency: 'Daily near a supportive wall or counter',
        instructions: [
          'Place one foot directly in front of the other so the heel of the front foot touches the toes of the back foot.',
          'Fix your gaze on a steady object ahead. Try to maintain equilibrium without swaying.',
          'Switch feet and repeat. Advanced: gently close eyes for 5-10 seconds with counter support.'
        ],
        precautions: 'Always practice with a firm handrail, wall, or caregiver nearby to prevent falls.',
        difficulty: 'Moderate'
      },
      {
        name: 'Sciatic Nerve Flossing (Neurodynamics)',
        targetMuscleOrJoint: 'Sciatic Nerve Tract & Dural Tube',
        reps: '10 smooth oscillations per side',
        frequency: 'Once or twice daily',
        instructions: [
          'Sit tall on a firm chair. Slump slightly with chin tucked to chest.',
          'As you extend one knee, tilt your head backward (looking up).',
          'As you lower the leg back down, gently lower your chin to chest again.'
        ],
        precautions: 'Do not pull into severe sharp pain; nerve flossing should feel like a gentle gliding sensation.',
        difficulty: 'Gentle / Beginner'
      }
    ],
    interactiveHotspots: [
      { part: 'Brain & Cranial Nerves', x: 50, y: 8, description: 'Cognitive motor control, voluntary movement execution, and sensory processing.' },
      { part: 'Spinal Cord Canal', x: 50, y: 32, description: 'Highway for motor commands from brain to limbs; vulnerability point in spondylosis.' },
      { part: 'Sciatic Nerve Root', x: 44, y: 56, description: 'Longest nerve in the human body; frequently compressed by herniated discs or piriformis.' }
    ]
  },
  {
    id: 'cardiovascular',
    name: 'Cardiovascular System',
    tamilName: 'இரத்த ஓட்ட மண்டலம் (Cardiovascular)',
    hindiName: 'हृदय संवहनी प्रणाली (Cardiovascular)',
    teluguName: 'రక్తప్రసరణ వ్యవస్థ',
    iconName: 'Heart',
    whyItMatters: 'Exercise tolerance, circulation and cardiac rehabilitation.',
    commonConditions: ['Heart disease', 'Post-heart surgery rehabilitation', 'Peripheral artery disease', 'Hypertension', 'Post-MI deconditioning'],
    anatomicalParts: ['Heart & Myocardium', 'Arterial & Venous Network', 'Capillary Beds', 'Thoracic Aorta'],
    dietRecommendations: {
      title: 'Endothelial Health & Low-Sodium Cardiac Nutrition',
      keyNutrients: ['Potassium', 'Soluble Dietary Fiber', 'Coenzyme Q10', 'Magnesium', 'Plant Sterols'],
      foodsToEat: [
        'Oats, barley, and pulses to naturally lower LDL cholesterol',
        'Pomegranates, garlic, and beetroots (rich in dietary nitrates that convert to nitric oxide for vasodilation)',
        'Potassium-rich bananas, tender coconut water, and pumpkin seeds to balance blood pressure',
        'Cold-pressed olive oil, mustard oil, or seed oils in moderate culinary amounts'
      ],
      foodsToAvoid: [
        'Salty packaged snacks, pickles, and processed meats (restrict sodium to <2000mg/day)',
        'Trans-fat loaded bakery goods and deep-fried foods'
      ],
      dailyHydrationTip: 'Maintain steady sips throughout the day. Dehydration increases blood viscosity and cardiac workload.',
      clinicalRationale: 'Optimizing blood pressure and arterial compliance directly improves exercise capacity (METs) during phase II and III cardiac rehabilitation.'
    },
    rehabilitationExercises: [
      {
        name: 'Graded Interval Aerobic Walking & Ankle Pumps',
        targetMuscleOrJoint: 'Peripheral Muscle Pump & Myocardial Efficiency',
        reps: '20 to 30 minutes graded walking + 20 ankle pumps hourly',
        frequency: 'Daily with pulse-rate monitoring',
        instructions: [
          'Begin with 5 minutes of slow warm-up walking.',
          'Progress to moderate brisk walking where you can speak in full sentences without gasping (Talk Test).',
          'Perform 20 ankle pumps when seated to assist the venous muscle pump return.'
        ],
        precautions: 'Stop immediately if you experience chest tightness, sudden shortness of breath, or dizziness.',
        difficulty: 'Gentle / Beginner'
      }
    ],
    interactiveHotspots: [
      { part: 'Heart & Central Circulation', x: 53, y: 28, description: 'Central pump circulating oxygenated blood to all active physical therapy muscles.' },
      { part: 'Peripheral Vascular Calf Pump', x: 42, y: 78, description: 'The "second heart" — calf muscle contractions pump deoxygenated blood back to heart.' }
    ]
  },
  {
    id: 'respiratory',
    name: 'Respiratory System',
    tamilName: 'சுவாச மண்டலம் (Respiratory System)',
    hindiName: 'श्वसन प्रणाली (Respiratory System)',
    teluguName: 'శ్వాసకోశ వ్యవస్థ',
    iconName: 'Wind',
    whyItMatters: 'Breathing exercises, airway clearance and improving endurance.',
    commonConditions: ['Asthma', 'COPD (Chronic Obstructive Pulmonary Disease)', 'Pneumonia recovery', 'Post-surgery atelectasis', 'Post-COVID lung fibrosis'],
    anatomicalParts: ['Diaphragm Muscle', 'Lungs & Bronchial Tree', 'Intercostal Musculature', 'Trachea'],
    dietRecommendations: {
      title: 'Pulmonary Vitality & Mucus Clearance Diet',
      keyNutrients: ['Vitamin C & Zinc', 'N-Acetylcysteine precursors', 'Beta-Carotene', 'Warm Anti-inflammatory Fluids'],
      foodsToEat: [
        'Citrus fruits (oranges, lemons, amla), bell peppers, and guava for alveolar tissue resilience',
        'Warm herbal infusions with ginger, tulsi, and cinnamon to ease bronchial airways',
        'Easily digestible nutrient-dense soups and lean broths to fuel respiratory muscles without bloating'
      ],
      foodsToAvoid: [
        'Excess cold dairy or iced drinks if they trigger phlegm in sensitive airways',
        'Very heavy, gas-producing meals that push against the diaphragm and restrict lung expansion'
      ],
      dailyHydrationTip: 'Ample warm water thins airway mucus, allowing easier clearance through physical therapy breathing techniques.',
      clinicalRationale: 'The diaphragm is a skeletal muscle; proper nutritional glycogen and electrolytes sustain ventilatory work.'
    },
    rehabilitationExercises: [
      {
        name: 'Diaphragmatic (Belly) Breathing',
        targetMuscleOrJoint: 'Diaphragm & Lower Lobes of Lungs',
        reps: '10 deep slow cycles',
        frequency: '3 to 4 times daily, especially in morning and evening',
        instructions: [
          'Sit comfortably with one hand on your chest and the other on your upper belly.',
          'Breathe in slowly through your nose. Feel your belly push outward while your chest remains quiet.',
          'Breathe out gently through pursed lips, allowing your belly to fall inward.'
        ],
        precautions: 'Do not force breath or hyperventilate; breathe gently and rhythmically.',
        difficulty: 'Gentle / Beginner'
      },
      {
        name: 'Pursed-Lip Breathing with Thoracic Expansion',
        targetMuscleOrJoint: 'Airway Stents & Intercostal Mobility',
        reps: '5-8 cycles',
        frequency: 'Whenever feeling breathless or during physical exertion',
        instructions: [
          'Inhale through nose for 2 counts.',
          'Pucker lips as if blowing out birthday candles.',
          'Exhale slowly and steadily for 4 counts (twice as long as inhale).'
        ],
        precautions: 'Never strain exhalation; keep shoulders soft and dropped.',
        difficulty: 'Gentle / Beginner'
      }
    ],
    interactiveHotspots: [
      { part: 'Lungs & Bronchial Tree', x: 50, y: 26, description: 'Gas exchange surface; targets of incentive spirometry and postural drainage.' },
      { part: 'Diaphragm Muscle Dome', x: 50, y: 36, description: 'Primary motor muscle of inspiration; separates thoracic and abdominal cavities.' }
    ]
  },
  {
    id: 'vestibular',
    name: 'Vestibular System',
    tamilName: 'உள் காது சமநிலை மண்டலம் (Vestibular System)',
    hindiName: 'वेस्टिबुलर प्रणाली (Vestibular System)',
    teluguName: 'వెస్టిబ్యులర్ బ్యాలెన్స్ వ్యవస్థ',
    iconName: 'Compass',
    whyItMatters: 'Balance and spatial orientation.',
    commonConditions: ['Vertigo (BPPV)', 'Dizziness', 'Meniere\'s disease', 'Vestibular neuritis', 'Balance disorders & falls'],
    anatomicalParts: ['Inner Ear Semicircular Canals', 'Vestibulocochlear Nerve (CN VIII)', 'Otolith Organs (Utricle & Saccule)', 'Cerebellum'],
    dietRecommendations: {
      title: 'Endolymphatic Fluid Balance & Inner Ear Stabilization',
      keyNutrients: ['Strict Electrolyte Balance', 'Low Sodium', 'Magnesium', 'Gingerols'],
      foodsToEat: [
        'Fresh whole foods with natural hydration (cucumbers, watermelon, coconut water in moderation)',
        'Fresh ginger tea (helps neutralize vestibular nausea naturally)',
        'Evenly spaced, consistent meals to prevent fluctuations in inner ear fluid osmolality',
        'Whole grains for steady blood sugar balance without dizzy spikes'
      ],
      foodsToAvoid: [
        'Excess sodium (causes fluid retention and endolymphatic hydrops inside inner ear canals)',
        'Caffeine and energy drinks (trigger vasospasm in cochlear-vestibular microvessels)',
        'Artificial sweeteners (aspartame triggers migraine-associated dizziness)'
      ],
      dailyHydrationTip: 'Maintain uniform fluid intake around the clock; avoiding sudden dehydration prevents vestibular vertigo flare-ups.',
      clinicalRationale: 'Endolymph and perilymph in semicircular canals rely on tight osmolar homeostasis to maintain calcium carbonate crystal balance.'
    },
    rehabilitationExercises: [
      {
        name: 'Gaze Stabilization (VOR - Vestibulo-Ocular Reflex)',
        targetMuscleOrJoint: 'Inner Ear Canals & Ocular Motor Nuclei',
        reps: '1 minute head turns, 2 sets',
        frequency: '2 to 3 times daily seated',
        instructions: [
          'Hold a target card or your thumb at arm\'s length in front of your eyes.',
          'Keep your eyes locked on the thumb while gently turning your head left and right (like saying "no").',
          'Repeat turning head up and down (like saying "yes") while keeping the target clear without blurring.'
        ],
        precautions: 'Start slowly; mild dizziness is normal initially, but take a short break if nausea arises.',
        difficulty: 'Moderate'
      }
    ],
    interactiveHotspots: [
      { part: 'Inner Ear Vestibular Apparatus', x: 50, y: 13, description: 'Contains semicircular canals sensing head rotation and gravity.' }
    ]
  },
  {
    id: 'integumentary',
    name: 'Integumentary System',
    tamilName: 'தோல் மண்டலம் (Integumentary System)',
    hindiName: 'त्वचा और ऊतक प्रणाली (Integumentary)',
    teluguName: 'చర్మ వ్యవస్థ',
    iconName: 'Shield',
    whyItMatters: 'Skin, wounds, scars and tissue healing.',
    commonConditions: ['Burns', 'Wounds & pressure ulcers', 'Post-surgical scars & keloids', 'Fascial adhesions', 'Contractures'],
    anatomicalParts: ['Epidermis & Dermis', 'Subcutaneous Fascia', 'Collagen Matrix', 'Microvascular Capillaries'],
    dietRecommendations: {
      title: 'Wound Granulation & Collagen Synthesis Nutrition',
      keyNutrients: ['L-Arginine & L-Glutamine', 'High Protein (1.2-1.5g/kg)', 'Vitamin C', 'Zinc', 'Vitamin A'],
      foodsToEat: [
        'High quality protein (paneer, tofu, legumes, fish, bone broth) to provide amino acids for tissue synthesis',
        'Amla, oranges, and tomatoes to provide Vitamin C (essential cofactor for collagen cross-linking)',
        'Pumpkin seeds and cashews for zinc (stimulates cellular re-epithelialization)',
        'Carrots and sweet potatoes (beta-carotene supporting skin barrier integrity)'
      ],
      foodsToAvoid: [
        'High sugar treats (advanced glycation end-products stiffen collagen and weaken scar remodeling)',
        'Dehydrating drinks and tobacco products'
      ],
      dailyHydrationTip: 'Healthy supple skin requires minimum 2.5L water daily; hydrated tissues have higher tensile elasticity.',
      clinicalRationale: 'Scar tissue maturation takes up to 12 months; physical therapy remodeling requires continuous protein substrates.'
    },
    rehabilitationExercises: [
      {
        name: 'Cross-Friction Scar Mobilization & Skin Gliding',
        targetMuscleOrJoint: 'Subcutaneous Fascia & Healed Incision Scar',
        reps: '5 minutes gentle circular & cross-directional massage',
        frequency: 'Twice daily once incision is fully closed (no scabs)',
        instructions: [
          'Wash hands thoroughly. Apply a dab of vitamin E oil or medical moisturizer.',
          'Place index fingers on either side of the scar.',
          'Gently roll and glide the skin against the underlying muscle bed in circular motions to break restrictive adhesions.'
        ],
        precautions: 'Never massage an open, bleeding, or infected wound. Only begin after doctor confirmation of wound closure.',
        difficulty: 'Gentle / Beginner'
      }
    ],
    interactiveHotspots: [
      { part: 'Dermal & Fascial Layer', x: 62, y: 40, description: 'External protective barrier and fascia layer that must glide smoothly over muscles.' }
    ]
  },
  {
    id: 'lymphatic',
    name: 'Lymphatic System',
    tamilName: 'நிணநீர் மண்டலம் (Lymphatic System)',
    hindiName: 'लसीका तंत्र (Lymphatic System)',
    teluguName: 'శోషరస వ్యవస్థ',
    iconName: 'Droplet',
    whyItMatters: 'Fluid drainage and swelling management.',
    commonConditions: ['Lymphedema', 'Post-cancer swelling (Mastectomy)', 'Chronic venous insufficiency edema', 'Post-traumatic joint effusion'],
    anatomicalParts: ['Cervical & Axillary Lymph Nodes', 'Thoracic Duct', 'Inguinal (Groin) Nodes', 'Superficial Lymph Vessels'],
    dietRecommendations: {
      title: 'Fluid Drain & Anti-Swelling Nutrition',
      keyNutrients: ['Flavonoids (Rutin, Hesperidin)', 'Potassium', 'Low Dietary Sodium (<1500mg)', 'Anti-inflammatory Antioxidants'],
      foodsToEat: [
        'Cucumbers, celery, watermelon, and barley water to encourage gentle physiological fluid clearance',
        'Berries and citrus fruits containing bioflavonoids that strengthen lymphatic vessel walls',
        'Clean, lightly cooked plant meals rich in minerals without chemical preservatives'
      ],
      foodsToAvoid: [
        'High sodium canned or fast foods (causes hydrostatic water retention)',
        'Heavy dairy creams and processed trans fats that burden lymph filtration'
      ],
      dailyHydrationTip: 'Counter-intuitively, drinking plenty of fresh water prevents the kidneys from conserving fluid, reducing overall edema.',
      clinicalRationale: 'Lymph vessels do not have a central pump like the heart; they rely on muscle contractions and fluid osmotic balance.'
    },
    rehabilitationExercises: [
      {
        name: 'Manual Lymphatic Drainage (MLD) Self-Clearance',
        targetMuscleOrJoint: 'Axillary, Clavicular & Inguinal Drainage Nodes',
        reps: '10 gentle skin-stretch strokes per area',
        frequency: 'Daily before putting on compression garments',
        instructions: [
          'Sit relaxed. Take 3 deep diaphragmatic breaths to stimulate the central thoracic duct.',
          'Use flat open palms to gently stretch and release the skin at the collarbones, then under the armpits.',
          'Lightly brush swollen limbs upward toward the cleared healthy node basin in an upward "wave" motion.'
        ],
        precautions: 'Pressure must be feather-light (just enough to move the surface skin, not deep muscle).',
        difficulty: 'Gentle / Beginner'
      },
      {
        name: 'Gravity-Assisted Limb Elevation & Gentle Pumps',
        targetMuscleOrJoint: 'Extremity Lymphatic Collectors',
        reps: '15 minutes elevation with 15 rhythmic muscle pumps',
        frequency: '2 times daily',
        instructions: [
          'Elevate the affected arm or leg above heart level supported comfortably on pillows.',
          'Gently flex and extend fingers/toes rhythmically to activate the natural muscle pump.'
        ],
        precautions: 'Do not allow limb to dangle without compression if diagnosed with severe secondary lymphedema.',
        difficulty: 'Gentle / Beginner'
      }
    ],
    interactiveHotspots: [
      { part: 'Axillary (Underarm) Nodes', x: 38, y: 25, description: 'Major lymph filtering station for the upper limbs and breast tissue.' },
      { part: 'Inguinal (Groin) Nodes', x: 44, y: 52, description: 'Primary drainage hub for the lower extremities and pelvis.' }
    ]
  },
  {
    id: 'reproductive_pelvic',
    name: 'Reproductive & Pelvic System',
    tamilName: 'இடுப்புத் தரை மற்றும் இனப்பெருக்க மண்டலம் (Pelvic Floor)',
    hindiName: 'श्रोणि तल एवं प्रजनन प्रणाली (Pelvic System)',
    teluguName: 'పెల్విక్ ఫ్లోర్ వ్యవస్థ',
    iconName: 'ShieldAlert',
    whyItMatters: 'Pelvic-floor and pregnancy-related rehabilitation.',
    commonConditions: ['Pelvic pain', 'Urinary / stress incontinence', 'Pregnancy & postpartum musculoskeletal issues', 'Diastasis recti', 'Prolapse'],
    anatomicalParts: ['Levator Ani & Pelvic Diaphragm', 'Pubococcygeus Muscle', 'Sacroiliac (SI) Joint', 'Pubic Symphysis'],
    dietRecommendations: {
      title: 'Pelvic Tone & Strain-Free Bowel Health Diet',
      keyNutrients: ['Insoluble & Soluble Dietary Fiber', 'Magnesium Citrate', 'Collagen Peptides', 'Bladder-Friendly Fluids'],
      foodsToEat: [
        'Papaya, prunes, soaked chia seeds, and oats to ensure soft, effortless bowel movements (eliminates pelvic floor straining)',
        'Warm water throughout the morning to maintain smooth bowel motility',
        'Protein-rich meals to rebuild post-partum and pelvic muscular tone'
      ],
      foodsToAvoid: [
        'Bladder irritants like excess caffeine, acidic tomato sauces, and spicy chilies if suffering from urge incontinence',
        'Constipating refined white flours (maida)'
      ],
      dailyHydrationTip: 'Do not restrict water out of fear of leakage; concentrated acidic urine irritates the bladder detrusor muscle, worsening spasms.',
      clinicalRationale: 'Chronic bearing down during bowel movements damages pelvic floor fascia and nerve innervations; nutrition prevents straining.'
    },
    rehabilitationExercises: [
      {
        name: 'Coordinated Pelvic Floor (Kegel) Activation & Release',
        targetMuscleOrJoint: 'Levator Ani & Pubococcygeus',
        reps: '10 contractions (5-sec hold) followed by complete 5-sec release',
        frequency: 'Twice daily lying or seated',
        instructions: [
          'Exhale and gently draw the pelvic floor muscles upward and inward, as if stopping flow of urine and holding gas.',
          'Hold without clenching your buttocks or holding your breath.',
          'Inhale and consciously drop and relax the pelvic floor completely.'
        ],
        precautions: 'Do not over-train if you suffer from hypertonic (overly tight) pelvic floor pain. The release phase is as important as the squeeze.',
        difficulty: 'Gentle / Beginner'
      },
      {
        name: 'Supported Pelvic Bridge with Adductor Squeeze',
        targetMuscleOrJoint: 'Gluteus Maximus & Pelvic Ring Stabilizers',
        reps: '12 repetitions with a soft pillow between knees',
        frequency: 'Daily on exercise mat',
        instructions: [
          'Lie on back with knees bent, feet hip-width apart. Place a pillow between your knees.',
          'Gently squeeze the pillow, engage the pelvic floor, and lift hips toward the ceiling.',
          'Hold 3 seconds at top and slowly roll your spine down vertebrae by vertebrae.'
        ],
        precautions: 'Keep neck relaxed; do not over-arch the lower back.',
        difficulty: 'Gentle / Beginner'
      }
    ],
    interactiveHotspots: [
      { part: 'Pelvic Floor Diaphragm', x: 50, y: 53, description: 'Muscular sling supporting bladder, uterus/prostate, and bowel continence.' },
      { part: 'Sacroiliac (SI) Joints', x: 55, y: 49, description: 'Key pelvic stability joints affected by relaxin hormone during pregnancy.' }
    ]
  }
];
