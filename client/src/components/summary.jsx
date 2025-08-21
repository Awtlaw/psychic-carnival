import './summary.css'

export function Summary() {
  return (
    <div class='ps-container'>
      <div class='ps-title'>Patient Summary</div>
      <hr />

      <div class='ps-section'>
        <h3>Patient Information</h3>
        <div class='ps-grid'>
          <div class='ps-label'>First Name</div>
          <div class='ps-value'>John</div>

          <div class='ps-label'>Last Name</div>
          <div class='ps-value'>Doe</div>

          <div class='ps-label'>Sex</div>
          <div class='ps-value'>Male</div>

          <div class='ps-label'>Age</div>
          <div class='ps-value'>29</div>

          <div class='ps-label'>Phone</div>
          <div class='ps-value'>+233 20 123 4567</div>

          <div class='ps-label'>Email</div>
          <div class='ps-value'>johndoe@email.com</div>

          <div class='ps-label'>Address</div>
          <div class='ps-value'>Accra, Ghana</div>
        </div>
      </div>
      <hr />

      <div class='ps-section'>
        <h3>Diagnosis & Recommendations</h3>
        <div class='ps-grid'>
          <div class='ps-label'>Diagnosis</div>
          <div class='ps-value'>Malaria</div>

          <div class='ps-label'>System Orthodox Drugs</div>
          <div class='ps-value'>Artemether, Lumefantrine</div>

          <div class='ps-label'>Doctor Recommended Drugs</div>
          <div class='ps-value'>Paracetamol, Vitamin C</div>

          <div class='ps-label'>Traditional Drugs</div>
          <div class='ps-value'>Neem extract, Herbal tea</div>
        </div>
      </div>
      <hr />

      <div class='ps-print'>
        <button class='ps-btn' onclick='window.print()'>
          Print Report
        </button>
      </div>
    </div>
  )
}
