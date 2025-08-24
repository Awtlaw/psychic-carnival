import './summary.css'

export function Summary() {
  return (
    <div className='doctor-container'>
      <h2 className='doctor-title'>Doctor’s View</h2>
      <hr />
      <hr />

      {/* Patient Info */}
      <div className='doctor-section'>
        <h3>Patient Info</h3>
        <div className='doctor-grid'>
          <div className='doctor-label'>Patient ID:</div>
          <div className='doctor-value'>2</div>

          <div className='doctor-label'>Report ID:</div>
          <div className='doctor-value'>1</div>

          <div className='doctor-label'>Created At:</div>
          <div className='doctor-value'>2025-08-18 15:55</div>
        </div>
      </div>
      <hr />
      <hr />

      {/* Symptom Report */}
      <div className='doctor-section'>
        <h3>Symptom Check Report</h3>
        <div className='doctor-grid'>
          <div className='doctor-label'>Patient’s Complaint:</div>
          <div className='doctor-value'>2 months, 61 days, M, Bodyache</div>

          <div className='doctor-label'>Confidence:</div>
          <div className='doctor-value'>High</div>

          <div className='doctor-label'>Emergency Case:</div>
          <div className='doctor-value'>No</div>
        </div>
      </div>
      <hr />
      <hr />

      {/* Possible Conditions */}
      <div className='doctor-section'>
        <h3>Possible Conditions</h3>
        <ul className='point'>
          <li>
            <b>Viral Illness:</b> – Body aches are a common sign of viral infections (e.g., cold, flu).
          </li>
          <li>
            <b>Post-Vaccination Reaction:</b> – Could be a side effect of recent immunization (fever, irritability).
          </li>
          <li>
            <b>Myalgia (Muscle Pain):</b> – General distress — could be viral, immune response, or discomfort.
          </li>
        </ul>
      </div>
      <hr />
      <hr />

      {/* Clinical Reasoning */}
      <div className='doctor-section'>
        <h3>Clinical Reasoning</h3>
        <p>Body ache in infants is non-specific but often points to viral illness or post-vaccination reaction.</p>
      </div>
      <hr />
      <hr />

      {/* Recommendations */}
      <div className='doctor-section'>
        <h3>Recommendations</h3>
        <ul className='point'>
          <li>
            <b>Immediate Actions:</b> Comfort, check fever, keep hydrated, avoid meds without pediatrician.
          </li>
          <li>
            <b>When to Seek Care:</b> Fever &gt; 100.4°F, poor feeding, lethargy, inconsolable crying, dehydration.
          </li>
          <li>
            <b>Suggested Tests:</b> CBC, Viral Panel, Urinalysis, Pediatric Exam.
          </li>
        </ul>
      </div>
      <hr />
      <hr />

      {/* Red Flags */}
      <div className='doctor-section'>
        <h3>Red Flags</h3>
        <ul className='point'>
          <li>Fever in infant &lt; 3 months</li>
          <li>Breathing difficulties</li>
          <li>Unusual lethargy</li>
          <li>Dehydration signs</li>
        </ul>
      </div>
      <hr />
      <hr />

      {/* Reference Cases */}
      <div className='doctor-section'>
        <h3>Reference Cases</h3>
        <ul className='point'>
          <li>Patient 22F → Pregnancy-related myalgia</li>
          <li>Patient 27F → Tension headache</li>
          <li>Patient 31F → Cyesis + headache</li>
          <li>Patient 26F → Amenorrhea + myalgia</li>
          <li>Patient 23F → Cyesis only</li>
        </ul>
      </div>
    </div>
  )
}
