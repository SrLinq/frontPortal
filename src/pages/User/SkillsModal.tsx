import { useState } from 'react';
import './SkillsModal.css';

interface SkillsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (skill: string) => void;
  existingSkills: string[];
}

const PREDEFINED_SKILLS = [
  "React",
  "TypeScript",
  "Node.js",
  "Python",
  "Figma",
  "UI/UX Design",
  "Data Analysis",
  "Marketing",
  "Project Management",
  "Java",
  "C++",
  "C#",
  "AWS",
  "Docker",
  "Machine Learning"
];

function SkillsModal({ isOpen, onClose, onAdd, existingSkills }: SkillsModalProps) {
  const [selectedSkill, setSelectedSkill] = useState("");

  if (!isOpen) return null;

  const availableSkills = PREDEFINED_SKILLS.filter(skill => !existingSkills.includes(skill));

  const handleAdd = () => {
    if (selectedSkill) {
      onAdd(selectedSkill);
      setSelectedSkill("");
    }
  };

  return (
    <div className="skills-modal-overlay">
      <div className="skills-modal-content">
        <h3 className="skills-modal-title">Add a New Skill</h3>
        
        <div className="skills-modal-body">
          <select 
            className="skills-modal-select"
            value={selectedSkill}
            onChange={(e) => setSelectedSkill(e.target.value)}
          >
            <option value="" disabled>Select a skill...</option>
            {availableSkills.map(skill => (
              <option key={skill} value={skill}>{skill}</option>
            ))}
          </select>
        </div>

        <div className="skills-modal-actions">
          <button 
            className="skills-modal-btn cancel-btn"
            onClick={onClose}
          >
            Cancel
          </button>
          <button 
            className="skills-modal-btn add-btn"
            onClick={handleAdd}
            disabled={!selectedSkill}
          >
            Add Skill
          </button>
        </div>
      </div>
    </div>
  );
}

export default SkillsModal;
