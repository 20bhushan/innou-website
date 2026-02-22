export default function RegisterModal() {
  return (
    <div className="modal" id="registerModal">
      <div className="modal-content">
        <span className="close">&times;</span>
        <h2>Register for INNOU 1.0</h2>
        <input type="text" placeholder="Your Name" />
        <input type="email" placeholder="Email" />
        <button className="btn-primary">Submit</button>
      </div>
    </div>
  );
}
