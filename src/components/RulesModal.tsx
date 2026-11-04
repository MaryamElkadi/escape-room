import { Footprints, Hand, RotateCw, ShieldCheck, Users, Volume1 } from 'lucide-react'
import { Modal } from './ui'

export function RulesModal({ onClose }: { onClose: () => void }) {
  return (
    <Modal
      title="Investigation Lab Rules"
      subtitle="Move calmly, work quietly, and look after the equipment."
      onClose={onClose}
      wide
    >
      <div className="rules-modal-grid">
        <div className="rule-tile">
          <Footprints size={24} />
          <h3>Walk, don&apos;t run</h3>
          <p>Stations are inside the classroom. Walk at all times and keep pathways clear.</p>
        </div>
        <div className="rule-tile">
          <Users size={24} />
          <h3>One visitor per team</h3>
          <p>Only the Navigator leaves the computer. One student per team at a station at a time.</p>
        </div>
        <div className="rule-tile">
          <Volume1 size={24} />
          <h3>Whisper-level voices</h3>
          <p>Other investigators are concentrating. Keep teamwork quiet and calm.</p>
        </div>
        <div className="rule-tile">
          <RotateCw size={24} />
          <h3>Rotate roles</h3>
          <p>Swap one role after every mission so everyone operates Excel and collects clues.</p>
        </div>
        <div className="rule-tile">
          <Hand size={24} />
          <h3>Hints are free</h3>
          <p>Use the hint button when stuck. No points are lost for asking for help.</p>
        </div>
        <div className="rule-tile">
          <ShieldCheck size={24} />
          <h3>Teacher verification</h3>
          <p>Finish the Excel task, then ask the teacher to check your screen and reveal the digit.</p>
        </div>
      </div>
      <div className="rules-flow">
        <span>1 · Read the steps</span>
        <span>→</span>
        <span>2 · Walk to the station</span>
        <span>→</span>
        <span>3 · Do the Excel task</span>
        <span>→</span>
        <span>4 · Teacher verifies</span>
        <span>→</span>
        <span>5 · Collect the digit</span>
      </div>
      <button type="button" className="btn btn-primary btn-block" onClick={onClose}>
        GOT IT · BACK TO THE MISSION
      </button>
    </Modal>
  )
}
