import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import axios from 'axios'

const HexagonSkill = ({ skill, index, isFlipped, onMouseEnter, onMouseLeave }) => {
  const proficiencyColor = skill.level >= 80 ? 'from-green-500 to-emerald-500' :
    skill.level >= 60 ? 'from-blue-500 to-cyan-500' :
      skill.level >= 40 ? 'from-yellow-500 to-orange-500' :
        'from-red-500 to-pink-500'

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05 }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="hexagon-container"
      style={{ perspective: '1000px' }}
    >
      <div className={`hexagon-flip ${isFlipped ? 'flipped' : ''}`}>
        {/* Front Side - Skill Name with Color Fill */}
        <div className="hexagon hexagon-front">
          <div className="hexagon-content">
            {/* Color fill from bottom with STRAIGHT top */}
            <div
              className={`hexagon-fill bg-gradient-to-t ${proficiencyColor} opacity-30`}
              style={{ height: `${skill.level}%` }}
            />
            <div className="hexagon-text">
              <h3 className="text-white font-bold text-xs md:text-sm">
                {skill.name}
              </h3>
            </div>
          </div>
        </div>

        {/* Back Side - Icon/Logo */}
        <div className="hexagon hexagon-back">
          <div className="hexagon-content">
            <div className="flex items-center justify-center h-full w-full">
              {skill.icon ? (
                <img
                  src={skill.icon}
                  alt={skill.name}
                  className="w-12 h-12 md:w-14 md:h-14 object-contain"
                />
              ) : (
                <span className="text-4xl md:text-5xl">💻</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

const Skills = () => {
  const [skills, setSkills] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [isFlipped, setIsFlipped] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  useEffect(() => {
    if (isPaused) return

    const interval = setInterval(() => {
      setIsFlipped(prev => !prev)
    }, 3500) // Flip all tiles every 3.5 seconds

    return () => clearInterval(interval)
  }, [isPaused])

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const [skillsRes, categoriesRes] = await Promise.all([
          axios.get('/api/skills'),
          axios.get('/api/skills/categories')
        ])
        setSkills(skillsRes.data)
        setCategories(['all', ...categoriesRes.data.categories])
      } catch (error) {
        console.error('Error fetching skills:', error)
      }
    }
    fetchSkills()
  }, [])

  const filteredSkills = selectedCategory === 'all'
    ? skills
    : skills.filter(skill => skill.category.toLowerCase() === selectedCategory.toLowerCase())

  return (
    <section id="skills" className="py-20 bg-transparent relative overflow-hidden">
      {/* Background decoration */}


      {/* Hexagon Styles */}
      <style>{`
        .hexagon-container {
          width: 100px;
          height: 115px;
          margin: 0;
        }

        .hexagon-flip {
          position: relative;
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
          transition: transform 0.8s;
        }

        .hexagon-flip.flipped {
          transform: rotateY(180deg);
        }

        .hexagon {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
        }

        .hexagon-front {
          background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
        }

        .hexagon-back {
          background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
          transform: rotateY(180deg);
        }

        .hexagon-content {
          position: relative;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-center;
          overflow: hidden;
        }

        .hexagon-fill {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          transition: height 0.3s ease;
        }

        .hexagon-text {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 10;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .hexagon-text h3 {
          text-align: center;
          width: 100%;
        }

        .honeycomb-grid {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: -24px;
        }

        .honeycomb-row {
          display: flex;
          gap: 8px;
          margin-bottom: -24px;
        }

        .honeycomb-row.offset {
          margin-left: 52px;
        }

        @media (min-width: 768px) {
          .hexagon-container {
            width: 110px;
            height: 127px;
          }

          .honeycomb-row {
            margin-bottom: -27px;
          }

          .honeycomb-row.offset {
            margin-left: 57px;
          }
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            className="text-center mb-8"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              My <span className="text-gradient">Skills</span>
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-primary-500 to-purple-500 mx-auto"></div>
          </motion.div>

          {/* Category Filter */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap justify-center gap-3 mb-12"
          >
            {categories.map((category) => (
              <motion.button
                key={category}
                onClick={() => setSelectedCategory(category)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-6 py-2 rounded-full font-semibold transition-all capitalize ${selectedCategory === category
                  ? 'bg-gradient-to-r from-primary-500 to-purple-500 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
              >
                {category}
              </motion.button>
            ))}
          </motion.div>

          {/* Skills Hexagon Grid - Honeycomb Pattern */}
          <div className="honeycomb-grid">
            {Array.from({ length: Math.ceil(filteredSkills.length / 15) }).map((_, rowPairIndex) => {
              const startIndex = rowPairIndex * 15
              const row1Skills = filteredSkills.slice(startIndex, startIndex + 8)
              const row2Skills = filteredSkills.slice(startIndex + 8, startIndex + 15)

              return (
                <div key={rowPairIndex}>
                  {row1Skills.length > 0 && (
                    <div className="honeycomb-row">
                      {row1Skills.map((skill, index) => (
                        <HexagonSkill
                          key={skill.id}
                          skill={skill}
                          index={startIndex + index}
                          isFlipped={isFlipped}
                          onMouseEnter={() => setIsPaused(true)}
                          onMouseLeave={() => setIsPaused(false)}
                        />
                      ))}
                    </div>
                  )}
                  {row2Skills.length > 0 && (
                    <div className="honeycomb-row offset">
                      {row2Skills.map((skill, index) => (
                        <HexagonSkill
                          key={skill.id}
                          skill={skill}
                          index={startIndex + 6 + index}
                          isFlipped={isFlipped}
                          onMouseEnter={() => setIsPaused(true)}
                          onMouseLeave={() => setIsPaused(false)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Skills
