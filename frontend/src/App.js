import React, { useState } from "react";

function App() {
  const [page, setPage] = useState(1);

  // --- Page 1 States ---
  const [volts, setVolts] = useState("");
  const [watts, setWatts] = useState("");
  const [width, setWidth] = useState("200");
  const [length, setLength] = useState("200");
  const [diameter, setDiameter] = useState("200");
  const [shape, setShape] = useState("Rectangle");
  const [connectionType, setConnectionType] = useState("Cable");
  const [connectionLength, setConnectionLength] = useState("");
  const [terminationPos, setTerminationPos] = useState("1-bottom");

  // --- Page 2 States ---
  const [fixingAdhesive, setFixingAdhesive] = useState("No");
  const [sensors, setSensors] = useState({
    PT100_PT1000: false,
    Thermocouple: false,
    Thermistor: false,
  });
  const selectedSensors = Object.keys(sensors).filter((key) => sensors[key]);
  const [limiterEnabled, setLimiterEnabled] = useState(false);
  const [foam, setFoam] = useState("None");
  const [initialQty, setInitialQty] = useState("");
  const [annualQty, setAnnualQty] = useState("");
  const [notes, setNotes] = useState("");

  // ----- Numeric conversions -----
  const widthNum = parseFloat(width) || 0;
  const lengthNum = parseFloat(length) || 0;
  const diameterNum = parseFloat(diameter) || 0;
  const voltsNum = parseFloat(volts) || 0;
  const wattsNum = parseFloat(watts) || 0;
  const connectionLengthNum = parseFloat(connectionLength) || 0;

  // ----- Reset helper Page 1 -----
  const clearPage1 = () => {
    setVolts("");
    setWatts("");
    setWidth("200");
    setLength("200");
    setDiameter("200");
    setShape("Rectangle");
    setConnectionType("Cable");
    setConnectionLength("");
    setTerminationPos("1-bottom");

    setFixingAdhesive("No");
    setSensors({ PT100_PT1000: false, Thermocouple: false, Thermistor: false });
    setLimiterEnabled(false);
    setFoam("None");
    setInitialQty("");
    setAnnualQty("");
    setNotes("");

    setPage(1);
  };

  // ----- Reset helper Page 2 -----
  const clearPage2 = () => {
    clearPage1();
  };

  // ----- Power Density -----
  let areaMM = 0;
  if (shape === "Rectangle") areaMM = widthNum * lengthNum;
  if (shape === "Circle") areaMM = Math.PI * Math.pow(diameterNum / 2, 2);

  const areaCM = areaMM / 100;
  const wattDensity = areaMM && wattsNum ? (wattsNum / areaCM).toFixed(2) : 0;

  // ----- Preview Scaling -----
  const maxPreview = 300;
  const minScale = 0.05;
  let scale = 1;

  if (shape === "Rectangle") {
    const largest = Math.max(widthNum, lengthNum);
    scale = Math.min(maxPreview / largest, 1);
  } else if (shape === "Circle") {
    scale = Math.min(maxPreview / diameterNum, 1);
  }

  scale = Math.max(scale, minScale);

  const previewWidth =
    shape === "Rectangle" ? widthNum * scale : diameterNum * scale;
  const previewHeight =
    shape === "Rectangle" ? lengthNum * scale : diameterNum * scale;

  const patchWidth = 20 * scale;
  const patchHeight = 30 * scale;
  const cableThickness = 6 * scale;
  const cableLength = 40 * scale;
  const leadThickness = patchWidth * 0.15;
  const leadLength = 30 * scale;
  const leadSpacing = patchWidth * 0.5;

  const heaterColor = foam === "None" ? "#8B0000" : "#d3d3d3";
  const foamActive = foam !== "None";

  // ----- Side-view foam thickness -----
  const foamPx =
    foam !== "None"
      ? 6 + parseInt(foam, 10) * 1.5 - Math.min(parseInt(foam, 10), 8) * 0.4
      : 0;

  // Termination label helper
  const terminationLabel =
    terminationPos === "1-bottom"
      ? "Middle of Width"
      : terminationPos === "2-left"
      ? "Middle of Length"
      : "Custom";

  return (
    <div style={{ fontFamily: "Arial", position: "relative", paddingTop: "84px" }}>
      <style>{`
        html { overflow-y: scroll; }
        .range-red { accent-color: #E50520; }
      `}</style>

      {/* STEP BAR */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          backgroundColor: "white",
          zIndex: 10,
          padding: "16px 24px",
          boxShadow: "0 2px 5px rgba(0,0,0,0.08)",
        }}
      >
        <div
          className="step-bar"
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "16px",
          }}
        >
          {[
            { num: 1, label: "Dimensions & Power" },
            { num: 2, label: "Add-Ons" },
            { num: 3, label: "Contact Information" },
          ].map((step, idx, arr) => (
            <React.Fragment key={step.num}>
              <div
                onClick={() => setPage(step.num)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                }}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    backgroundColor: page === step.num ? "#E50520" : "#cfcfcf",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "bold",
                  }}
                >
                  {step.num}
                </div>
                <span
                  className="step-label"
                  style={{
                    marginLeft: 8,
                    color: page === step.num ? "#E50520" : "#666",
                    fontWeight: page === step.num ? "bold" : "normal",
                  }}
                >
                  {step.label}
                </span>
              </div>
              {idx < arr.length - 1 && (
                <div
                  style={{
                    width: 120,
                    height: 2,
                    backgroundColor: page >= arr[idx + 1].num ? "#E50520" : "#cfcfcf",
                  }}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* MAIN LAYOUT */}
      <div
        className="main-layout"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          gap: "20px",
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "30px 20px",
        }}
      >
        {/* LEFT PANEL */}
        <div className="left-panel" style={{ flex: 1.2, paddingRight: 20 }}>
          {/* PAGE 1 */}
          {page === 1 && (
            <>
              <h1
                style={{
                  color: "#E50520",
                  fontSize: "26px",
                  marginBottom: "20px",
                  fontWeight: "bold",
                  textAlign: "left",
                }}
              >
                Dimensions & Power
              </h1>

              {/* DIMENSIONS CARD */}
              <div
                style={{
                  backgroundColor: "white",
                  borderRadius: "10px",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
                  padding: "20px",
                  marginBottom: "24px",
                }}
              >
                <h3 style={{ color: "#E50520", marginBottom: "12px" }}>Dimensions</h3>

                <div style={{ marginBottom: "14px" }}>
                  {["Rectangle", "Circle", "Attachment"].map((option) => (
                    <label key={option} style={{ marginRight: "15px" }}>
                      <input
                        type="radio"
                        name="shape"
                        checked={shape === option}
                        onChange={() => setShape(option)}
                      />
                      <span style={{ marginLeft: "5px" }}>{option}</span>
                    </label>
                  ))}
                </div>

                {shape === "Attachment" && (
                  <p style={{ fontSize: "13px", color: "#555" }}>
                    Upload your drawing in the Contact Information step.
                  </p>
                )}

                {shape === "Rectangle" && (
                  <>
                    <div
                      style={{ fontSize: "12px", color: "#666", marginBottom: 4 }}
                    >
                      Max Width 940mm
                    </div>
                    <label style={{ fontWeight: "bold" }}>Width (mm):</label>
                    <div
                      style={{ display: "flex", gap: "10px", margin: "6px 0" }}
                    >
                      <input
                        type="range"
                        className="range-red"
                        max="940"
                        value={width}
                        onChange={(e) => setWidth(e.target.value)}
                        style={{ flex: 1 }}
                      />
                      <input
                        type="number"
                        max="940"
                        value={width}
                        onChange={(e) => {
                          const v = Number(e.target.value);
                          if (v <= 940) setWidth(e.target.value);
                        }}
                        style={{
                          width: "80px",
                          padding: "6px",
                          borderRadius: "6px",
                          border: "1px solid #ccc",
                        }}
                      />
                    </div>

                    <div
                      style={{
                        marginTop: "14px",
                        fontSize: "12px",
                        color: "#666",
                      }}
                    >
                      Max Length 3000mm
                    </div>
                    <label style={{ fontWeight: "bold" }}>Length (mm):</label>
                    <div
                      style={{ display: "flex", gap: "10px", margin: "6px 0" }}
                    >
                      <input
                        type="range"
                        className="range-red"
                        max="3000"
                        value={length}
                        onChange={(e) => setLength(e.target.value)}
                        style={{ flex: 1 }}
                      />
                      <input
                        type="number"
                        max="3000"
                        value={length}
                        onChange={(e) => {
                          const v = Number(e.target.value);
                          if (v <= 3000) setLength(e.target.value);
                        }}
                        style={{
                          width: "80px",
                          padding: "6px",
                          borderRadius: "6px",
                          border: "1px solid #ccc",
                        }}
                      />
                    </div>
                  </>
                )}

                {shape === "Circle" && (
                  <div
                    style={{ display: "flex", gap: "10px", margin: "6px 0" }}
                  >
                    <label style={{ width: 110, fontWeight: "bold" }}>
                      Diameter (mm):
                    </label>
                    <input
                      type="range"
                      className="range-red"
                      max="940"
                      value={diameter}
                      onChange={(e) => setDiameter(e.target.value)}
                      style={{ flex: 1 }}
                    />
                    <input
                      type="text"
                      value={diameter}
                      onChange={(e) => setDiameter(e.target.value)}
                      style={{
                        width: "90px",
                        padding: "6px",
                        borderRadius: "6px",
                        border: "1px solid #ccc",
                      }}
                    />
                  </div>
                )}
              </div>

              {/* ATTACHMENT FILE UPLOAD (ONLY WHEN Attachment) */}
              {shape === "Attachment" && (
                <div
                  style={{
                    backgroundColor: "white",
                    borderRadius: "10px",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
                    padding: "20px",
                    marginBottom: "24px",
                  }}
                >
                  <h3 style={{ color: "#E50520" }}>Upload Attachment</h3>
                  <input type="file" name="attachment" accept=".pdf,.png,.jpg,.jpeg,.gif,.svg" />
                </div>
              )}

              {/* POWER CARD */}
              <div
                style={{
                  backgroundColor: "white",
                  borderRadius: "10px",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
                  padding: "20px",
                  marginBottom: "24px",
                }}
              >
                <h3 style={{ color: "#E50520" }}>Electrical Configuration</h3>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      alignItems: "center",
                    }}
                  >
                    <label style={{ width: 100, fontWeight: "bold" }}>
                      Voltage (V):
                    </label>
                    <input
                      type="number"
                      value={volts}
                      onChange={(e) => setVolts(e.target.value)}
                      placeholder="e.g. 230"
                      style={{
                        flex: 1,
                        padding: "8px",
                        borderRadius: "6px",
                        border: "1px solid #ccc",
                      }}
                    />
                  </div>

                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      alignItems: "center",
                    }}
                  >
                    <label style={{ width: 100, fontWeight: "bold" }}>
                      Wattage (W):
                    </label>
                    <input
                      type="number"
                      value={watts}
                      onChange={(e) => setWatts(e.target.value)}
                      placeholder="e.g. 500"
                      style={{
                        flex: 1,
                        padding: "8px",
                        borderRadius: "6px",
                        border: "1px solid #ccc",
                      }}
                    />
                  </div>
                </div>

                {shape !== "Attachment" && (
                  <div
                    style={{
                      backgroundColor: "#f3f6fa",
                      padding: "10px",
                      borderRadius: "6px",
                      marginTop: "16px",
                      textAlign: "center",
                      fontWeight: "bold",
                    }}
                  >
                    Power Density: {wattDensity} W/cm²
                  </div>
                )}
              </div>

              {/* CONNECTION CARD */}
              <div
                style={{
                  backgroundColor: "white",
                  borderRadius: "10px",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
                  padding: "20px",
                  marginBottom: "24px",
                }}
              >
                <h3 style={{ color: "#E50520" }}>Connection Type</h3>

                {["Cable", "Leads"].map((type) => (
                  <label
                    key={type}
                    style={{ display: "block", marginBottom: "6px" }}
                  >
                    <input
                      type="radio"
                      name="connection"
                      checked={connectionType === type}
                      onChange={() => setConnectionType(type)}
                    />
                    <span style={{ marginLeft: "6px" }}>{type}</span>
                  </label>
                ))}

                <div
                  style={{ display: "flex", gap: "10px", alignItems: "center" }}
                >
                  <label style={{ width: 180, fontWeight: "bold" }}>
                    Connection Length (metres):
                  </label>
                  <input
                    type="text"
                    value={connectionLength}
                    onChange={(e) => setConnectionLength(e.target.value)}
                    style={{
                      width: 90,
                      padding: "6px",
                      borderRadius: "6px",
                      border: "1px solid #ccc",
                    }}
                  />
                </div>
              </div>

              {/* TERMINATION POSITION CARD */}
              <div
                style={{
                  backgroundColor: "white",
                  borderRadius: "10px",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
                  padding: "20px",
                  marginBottom: "24px",
                }}
              >
                <h3 style={{ color: "#E50520" }}>Termination Position</h3>

                {[
                  { value: "1-bottom", label: "Option 1 (Middle of Width)" },
                  { value: "2-left", label: "Option 2 (Middle of Length)" },
                  { value: "other", label: "Option 3 (Custom)" },
                ].map((pos) => (
                  <label
                    key={pos.value}
                    style={{ display: "block", marginBottom: "6px" }}
                  >
                    <input
                      type="radio"
                      name="termination"
                      checked={terminationPos === pos.value}
                      onChange={() => setTerminationPos(pos.value)}
                    />
                    <span style={{ marginLeft: "6px" }}>{pos.label}</span>
                  </label>
                ))}
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  style={{
                    padding: "10px 20px",
                    backgroundColor: "#f44336",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                  }}
                  onClick={clearPage1}
                >
                  Clear
                </button>

                <button
                  style={{
                    padding: "10px 20px",
                    backgroundColor: "#1976d2",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                  }}
                  onClick={() => setPage(2)}
                >
                  Next: Add-Ons
                </button>
              </div>
            </>
          )}

          {/* -------- PAGE 2 -------- */}
          {page === 2 && (
            <>
              <h1
                style={{
                  color: "#E50520",
                  fontSize: "26px",
                  fontWeight: "bold",
                  marginBottom: "20px",
                }}
              >
                Add-Ons
              </h1>

              {/* ADD-ONS CARD */}
              <div
                style={{
                  backgroundColor: "white",
                  borderRadius: "10px",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
                  padding: "20px",
                  marginBottom: "24px",
                }}
              >
                {/* SELF ADHESIVE */}
                <div style={{ marginBottom: "20px" }}>
                  <h3 style={{ color: "#E50520" }}>Self Adhesive</h3>
                  {["Yes", "No"].map((option) => (
                    <label key={option} style={{ marginRight: "20px" }}>
                      <input
                        type="radio"
                        name="adhesive"
                        checked={fixingAdhesive === option}
                        onChange={() => setFixingAdhesive(option)}
                      />
                      {option}
                    </label>
                  ))}
                </div>

                {/* SENSORS */}
                <div style={{ marginBottom: "20px" }}>
                  <h3 style={{ color: "#E50520" }}>Sensors</h3>

                  <label style={{ marginRight: 10 }}>
                    <input
                      type="checkbox"
                      checked={sensors.PT100_PT1000}
                      onChange={() =>
                        setSensors((prev) => ({
                          ...prev,
                          PT100_PT1000: !prev.PT100_PT1000,
                        }))
                      }
                    />{" "}
                    PT100/PT1000
                  </label>

                  <label style={{ marginRight: 10 }}>
                    <input
                      type="checkbox"
                      checked={sensors.Thermocouple}
                      onChange={() =>
                        setSensors((prev) => ({
                          ...prev,
                          Thermocouple: !prev.Thermocouple,
                        }))
                      }
                    />{" "}
                    Thermocouple
                  </label>

                  <label>
                    <input
                      type="checkbox"
                      checked={sensors.Thermistor}
                      onChange={() =>
                        setSensors((prev) => ({
                          ...prev,
                          Thermistor: !prev.Thermistor,
                        }))
                      }
                    />{" "}
                    Thermistor
                  </label>
                </div>

                {/* THERMAL LIMITER */}
                <div style={{ marginBottom: "20px" }}>
                  <h3 style={{ color: "#E50520" }}>Thermal Limiter</h3>
                  {["Yes", "No"].map((option) => (
                    <label key={option} style={{ marginRight: "20px" }}>
                      <input
                        type="radio"
                        name="limiter"
                        checked={limiterEnabled === (option === "Yes")}
                        onChange={() => setLimiterEnabled(option === "Yes")}
                      />
                      {option}
                    </label>
                  ))}
                </div>

                {/* THERMAL INSULATION */}
                <div>
                  <h3 style={{ color: "#E50520" }}>Thermal Insulation</h3>
                  {["None", "3mm", "5mm", "8mm", "12mm"].map((f) => (
                    <label key={f} style={{ marginRight: 12 }}>
                      <input
                        type="radio"
                        name="foam"
                        checked={foam === f}
                        onChange={() => setFoam(f)}
                      />
                      {f === "None" ? "None" : f}
                    </label>
                  ))}
                </div>
              </div>

              {/* QUANTITY CARD */}
              <div
                style={{
                  backgroundColor: "white",
                  borderRadius: "10px",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
                  padding: "20px",
                  marginBottom: "24px",
                }}
              >
                <h3 style={{ color: "#E50520" }}>Quantity Requirements</h3>

                <div
                  style={{ display: "flex", gap: "10px", marginBottom: "12px" }}
                >
                  <label style={{ width: 190, fontWeight: "bold" }}>
                    Initial Quantity:
                  </label>
                  <input
                    type="text"
                    value={initialQty}
                    onChange={(e) =>
                      setInitialQty(e.target.value.replace(/\D/g, ""))
                    }
                    style={{
                      width: 120,
                      padding: "6px",
                      borderRadius: "6px",
                      border: "1px solid #ccc",
                    }}
                  />
                </div>

                <div style={{ display: "flex", gap: "10px" }}>
                  <label style={{ width: 190, fontWeight: "bold" }}>
                    Est. Annual Quantity:
                  </label>
                  <input
                    type="text"
                    value={annualQty}
                    onChange={(e) =>
                      setAnnualQty(e.target.value.replace(/\D/g, ""))
                    }
                    style={{
                      width: 120,
                      padding: "6px",
                      borderRadius: "6px",
                      border: "1px solid #ccc",
                    }}
                  />
                </div>
              </div>

              <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
                <button
                  style={{
                    padding: "10px 20px",
                    backgroundColor: "#f44336",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                  }}
                  onClick={clearPage2}
                >
                  Clear All
                </button>

                <button
                  style={{
                    padding: "10px 20px",
                    backgroundColor: "#1976d2",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                  }}
                  onClick={() => setPage(1)}
                >
                  Back
                </button>

                <button
                  style={{
                    padding: "10px 20px",
                    backgroundColor: "#1976d2",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                  }}
                  onClick={() => setPage(3)}
                >
                  Continue to Contact Info
                </button>
              </div>
            </>
          )}

          {/* ----- PAGE 3: CONTACT INFO ----- */}
          {page === 3 && (
            <>
              <h1
                style={{
                  color: "#E50520",
                  fontSize: "26px",
                  fontWeight: "bold",
                  marginBottom: "20px",
                }}
              >
                Contact Information
              </h1>

              <form
  action="https://formspree.io/f/mnnkdpgq"
  method="POST"
  enctype="multipart/form-data"
  style={{
    backgroundColor: "white",
    borderRadius: "10px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
    padding: "20px",
    width: "85%",
  }}
>
<input type="hidden" name="_upload" value="true" />

                <h3 style={{ color: "#E50520" }}>Name:</h3>
                <input
                  type="text"
                  name="name"
                  required
                  style={{ width: "100%", padding: "8px" }}
                />

                <h3 style={{ color: "#E50520" }}>Company:</h3>
                <input
                  type="text"
                  name="company"
                  style={{ width: "100%", padding: "8px" }}
                />

                <h3 style={{ color: "#E50520" }}>Email:</h3>
                <input
                  type="email"
                  name="email"
                  required
                  style={{ width: "100%", padding: "8px" }}
                />

                <h3 style={{ color: "#E50520" }}>Phone:</h3>
                <input
                  type="tel"
                  name="phone"
                  style={{ width: "100%", padding: "8px" }}
                />

                <h3 style={{ color: "#E50520" }}>Additional Notes:</h3>
                <textarea
                  name="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  style={{
                    width: "100%",
                    height: "100px",
                    padding: "8px",
                    resize: "vertical",
                    fontFamily: "inherit",
                    fontSize: "14px",
                  }}
                />

                <h3 style={{ color: "#E50520", marginTop: "10px" }}>
                  Attachment (optional):
                </h3>
               <input
  type="file"
  name="file"
  accept="*/*"
  style={{ width: "100%", padding: "6px" }}
/>

                {/* Hidden config fields */}
                <input type="hidden" name="shape" value={shape} />
                <input type="hidden" name="width" value={widthNum} />
                <input type="hidden" name="length" value={lengthNum} />
                <input type="hidden" name="diameter" value={diameterNum} />
                <input type="hidden" name="voltage" value={voltsNum} />
                <input type="hidden" name="wattage" value={wattsNum} />
                <input type="hidden" name="powerDensity" value={wattDensity} />
                <input type="hidden" name="connectionType" value={connectionType} />
                <input
                  type="hidden"
                  name="connectionLength"
                  value={connectionLength}
                />
                <input
                  type="hidden"
                  name="terminationPosition"
                  value={terminationLabel}
                />
                <input type="hidden" name="adhesive" value={fixingAdhesive} />
                <input type="hidden" name="foam" value={foam} />
                <input
                  type="hidden"
                  name="sensors"
                  value={[
                    sensors.PT100_PT1000 && "PT100/PT1000",
                    sensors.Thermocouple && "Thermocouple",
                    sensors.Thermistor && "Thermistor",
                  ]
                    .filter(Boolean)
                    .join(", ")}
                />
                <input
                  type="hidden"
                  name="limiter"
                  value={limiterEnabled ? "Yes" : "No"}
                />
                <input
                  type="hidden"
                  name="initialQty"
                  value={initialQty || ""}
                />
                <input
                  type="hidden"
                  name="annualQty"
                  value={annualQty || ""}
                />

                <div
                  style={{ marginTop: "30px", display: "flex", gap: "10px" }}
                >
                  <button
                    type="button"
                    onClick={() => setPage(2)}
                    style={{
                      padding: "10px 20px",
                      backgroundColor: "#1976d2",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                    }}
                  >
                    Back
                  </button>

                  <button
                    type="submit"
                    style={{
                      padding: "10px 20px",
                      backgroundColor: "green",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                    }}
                  >
                    Submit Enquiry
                  </button>
                </div>
              </form>
            </>
          )}
        </div>

        {/* RIGHT PANEL: PREVIEW + SUMMARY */}
        <div
          className="right-panel"
          style={{
            flex: 1,
            textAlign: "center",
            backgroundColor: "#f9f9f9",
            padding: "20px",
            borderRadius: "8px",
          }}
        >
          <h3 style={{ marginBottom: 20 }}>Preview</h3>

          {shape !== "Attachment" ? (
            <div
              className="preview-wrapper"
              style={{
                position: "relative",
                width: "100%",
                minHeight: 340,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <div
                style={{
                  position: "relative",
                  width: previewWidth,
                  height: previewHeight,
                }}
              >
                {/* HEATER BODY */}
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    backgroundColor: heaterColor,
                    borderRadius: shape === "Circle" ? "50%" : "0px",
                    position: "relative",
                  }}
                >
                  {/* SENSOR PATCHES */}
                  {!foamActive &&
                    selectedSensors.map((sensor, index) => {
                      const total = selectedSensors.length;
                      const offset =
                        (index - (total - 1) / 2) * (patchWidth * 1.2);
                      return (
                        <div
                          key={sensor}
                          style={{
                            position: "absolute",
                            width: patchWidth * 0.8,
                            height: patchHeight * 0.8,
                            backgroundColor: "#b22222",
                            top: "50%",
                            left: `calc(50% + ${offset}px)`,
                            transform: "translate(-50%, -50%)",
                            border: "1px solid #800000",
                            borderRadius: "2px",
                            zIndex: 3,
                          }}
                        />
                      );
                    })}

                  {/* THERMAL LIMITER */}
                  {!foamActive && limiterEnabled && (
                    <>
                      {terminationPos === "1-bottom" && (
                        <div
                          style={{
                            position: "absolute",
                            width: patchWidth * 0.9,
                            height: patchWidth * 0.9,
                            borderRadius: "50%",
                            backgroundColor: "#b22222",
                            border: "1px solid #800000",
                            bottom: patchHeight + 4 * scale,
                            left: "50%",
                            transform: "translateX(-50%)",
                            zIndex: 3,
                          }}
                        />
                      )}
                      {terminationPos === "2-left" && (
                        <div
                          style={{
                            position: "absolute",
                            width: patchWidth * 0.9,
                            height: patchWidth * 0.9,
                            borderRadius: "50%",
                            backgroundColor: "#b22222",
                            border: "1px solid #800000",
                            top: "50%",
                            left: patchWidth + 4 * scale,
                            transform: "translateY(-50%)",
                            zIndex: 2,
                          }}
                        />
                      )}
                    </>
                  )}

                  {/* TERMINATION PATCHES */}
                  {!foamActive && terminationPos === "1-bottom" && (
                    <div
                      style={{
                        position: "absolute",
                        width: patchWidth,
                        height: patchHeight,
                        backgroundColor: "#b22222",
                        left: "50%",
                        bottom: (patchWidth - patchHeight) / 2,
                        transform: "translateX(-50%) rotate(90deg)",
                        border: "1px solid #800000",
                        zIndex: 2,
                      }}
                    />
                  )}

                  {!foamActive && terminationPos === "2-left" && (
                    <div
                      style={{
                        position: "absolute",
                        width: patchWidth,
                        height: patchHeight,
                        backgroundColor: "#b22222",
                        top: "50%",
                        left: 0,
                        transform: "translateY(-50%) rotate(180deg)",
                        border: "1px solid #800000",
                        zIndex: 2,
                      }}
                    />
                  )}

                  {/* CABLES / LEADS */}
                  {terminationPos === "1-bottom" && (
                    <>
                      {connectionType === "Cable" && (
                        <div
                          style={{
                            position: "absolute",
                            width: cableThickness,
                            height: cableLength,
                            backgroundColor: "black",
                            bottom: -cableLength,
                            left: "50%",
                            transform: "translateX(-50%)",
                            zIndex: 4,
                          }}
                        />
                      )}

                      {connectionType === "Leads" && (
                        <>
                          <div
                            style={{
                              position: "absolute",
                              width: leadThickness,
                              height: leadLength,
                              backgroundColor: "black",
                              bottom: -leadLength,
                              left: "50%",
                              transform: `translateX(-${
                                leadSpacing / 2 + leadThickness / 2
                              }px)`,
                              zIndex: 4,
                            }}
                          />
                          <div
                            style={{
                              position: "absolute",
                              width: leadThickness,
                              height: leadLength,
                              backgroundColor: "black",
                              bottom: -leadLength,
                              left: "50%",
                              transform: `translateX(${
                                leadSpacing / 2 - leadThickness / 2
                              }px)`,
                              zIndex: 4,
                            }}
                          />
                        </>
                      )}
                    </>
                  )}

                  {terminationPos === "2-left" && (
                    <>
                      {connectionType === "Cable" && (
                        <div
                          style={{
                            position: "absolute",
                            width: cableLength,
                            height: cableThickness,
                            backgroundColor: "black",
                            left: -cableLength,
                            top: "50%",
                            transform: "translateY(-50%)",
                            zIndex: 4,
                          }}
                        />
                      )}

                      {connectionType === "Leads" && (
                        <>
                          <div
                            style={{
                              position: "absolute",
                              width: leadLength,
                              height: leadThickness,
                              backgroundColor: "black",
                              left: -leadLength,
                              top: "50%",
                              transform: `translateY(calc(-50% - ${
                                leadSpacing / 2
                              }px))`,
                              zIndex: 4,
                            }}
                          />
                          <div
                            style={{
                              position: "absolute",
                              width: leadLength,
                              height: leadThickness,
                              backgroundColor: "black",
                              left: -leadLength,
                              top: "50%",
                              transform: `translateY(calc(-50% + ${
                                leadSpacing / 2
                              }px))`,
                              zIndex: 4,
                            }}
                          />
                        </>
                      )}
                    </>
                  )}
                </div>

                {/* DIMENSION LABELS */}
                {shape === "Rectangle" && (
                  <>
                    <div
                      style={{
                        position: "absolute",
                        top: -32,
                        left: "50%",
                        transform: "translateX(-50%)",
                        fontSize: "12px",
                        fontWeight: "bold",
                      }}
                    >
                      {widthNum} mm
                    </div>

                    <div
                      style={{
                        position: "absolute",
                        top: -15,
                        left: 0,
                        width: previewWidth,
                        height: 1,
                        backgroundColor: "black",
                      }}
                    />

                    <div
                      style={{
                        position: "absolute",
                        top: -19,
                        left: -1,
                        width: 1,
                        height: 8,
                        backgroundColor: "black",
                      }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        top: -19,
                        left: previewWidth - 1,
                        width: 1,
                        height: 8,
                        backgroundColor: "black",
                      }}
                    />

                    <div
                      style={{
                        position: "absolute",
                        left: previewWidth + 5,
                        top: "50%",
                        transform: "translateY(-50%) rotate(90deg)",
                        fontSize: "12px",
                        fontWeight: "bold",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {lengthNum} mm
                    </div>

                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: previewWidth + 10,
                        width: 1,
                        height: previewHeight,
                        backgroundColor: "black",
                      }}
                    />

                    <div
                      style={{
                        position: "absolute",
                        top: -1,
                        left: previewWidth + 6,
                        width: 8,
                        height: 1,
                        backgroundColor: "black",
                      }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        top: previewHeight - 1,
                        left: previewWidth + 6,
                        width: 8,
                        height: 1,
                        backgroundColor: "black",
                      }}
                    />
                  </>
                )}

                {shape === "Circle" && (
                  <div
                    style={{
                      position: "absolute",
                      top: -24,
                      left: "50%",
                      transform: "translateX(-50%)",
                      fontSize: "12px",
                      fontWeight: "bold",
                    }}
                  >
                    Ø {diameterNum} mm
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div
              style={{
                width: "100%",
                minHeight: 160,
                backgroundColor: "#ececec",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 20,
              }}
            >
              🔒 Preview disabled in Attachment mode
            </div>
          )}

          <div
            style={{
              fontWeight: "bold",
              fontSize: "14px",
              marginBottom: "20px",
            }}
          >
            Connection Length: {connectionLength || "0"} m
          </div>

          {/* SIDE VIEW */}
          <div style={{ marginTop: "30px", textAlign: "center" }}>
            {foam !== "None" && (
              <div style={{ fontSize: "14px", marginBottom: "10px" }}>
                Connection Side with {foam} Foam
              </div>
            )}

            <div
              style={{
                position: "relative",
                width: 220,
                margin: "0 auto",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {foam === "None" && (
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    top: "-5px",
                    width: 18,
                    height: 5,
                    backgroundColor: "#8B0000",
                    zIndex: 2,
                  }}
                />
              )}

              <div
                style={{
                  position: "absolute",
                  left: -40,
                  top: foam === "None" ? "-2px" : `${foamPx - 2}px`,
                  width: 40,
                  height: 3,
                  backgroundColor: "black",
                  zIndex: 1,
                }}
              />

              {foam !== "None" && (
                <div
                  style={{
                    height: foamPx,
                    width: "100%",
                    backgroundColor: "#d3d3d3",
                  }}
                />
              )}

              <div
                style={{
                  height: 3,
                  width: "100%",
                  backgroundColor: "#8B0000",
                }}
              />

              {fixingAdhesive === "Yes" && (
                <div
                  style={{
                    height: 2,
                    width: "100%",
                    backgroundColor: "#b38f5a",
                  }}
                />
              )}
            </div>
          </div>

          {fixingAdhesive === "Yes" && (
            <div
              style={{
                color: "#000",
                fontSize: "14px",
                marginTop: "10px",
              }}
            >
              Self-Adhesive Side
            </div>
          )}

          {/* SUMMARY */}
          <div
            style={{
              marginTop: "30px",
              textAlign: "left",
              backgroundColor: "#fff",
              padding: "15px 20px",
              borderRadius: "8px",
              boxShadow: "0 0 5px rgba(0,0,0,0.1)",
              fontSize: "14px",
              color: "#333",
            }}
          >
            <h4
              style={{
                marginBottom: "10px",
                color: "#E50520",
                fontSize: "18px",
              }}
            >
              Heater Summary
            </h4>

            <p>
              <strong>Dimensions:</strong> {shape}
            </p>

            {shape === "Rectangle" && (
              <p>
                <strong>Size:</strong> {widthNum} mm × {lengthNum} mm
              </p>
            )}

            {shape === "Circle" && (
              <p>
                <strong>Diameter:</strong> Ø {diameterNum} mm
              </p>
            )}

            {shape === "Attachment" && (
              <p>
                <strong>Note:</strong> Attachment drawing / file to be supplied.
              </p>
            )}

            <p>
              <strong>Power:</strong> {wattsNum} W @ {voltsNum} V
            </p>

            {shape !== "Attachment" && (
              <p>
                <strong>Power Density:</strong> {wattDensity} W/cm²
              </p>
            )}

            <p>
              <strong>Connection:</strong> {connectionType} ({connectionLength} m)
            </p>
            <p>
              <strong>Termination:</strong> {terminationLabel}
            </p>
            <p>
              <strong>Adhesive:</strong> {fixingAdhesive}
            </p>

            {(foam !== "None" ||
              sensors.PT100_PT1000 ||
              sensors.Thermocouple ||
              sensors.Thermistor ||
              limiterEnabled) && (
              <div>
                <h4
                  style={{
                    margin: "10px 0",
                    color: "#E50520",
                    fontSize: "17px",
                  }}
                >
                  Add-Ons
                </h4>

                {foam !== "None" && (
                  <p>
                    <strong>Thermal Insulation:</strong> {foam} Foam
                  </p>
                )}

                {(sensors.PT100_PT1000 ||
                  sensors.Thermocouple ||
                  sensors.Thermistor) && (
                  <p>
                    <strong>Sensors:</strong>{" "}
                    {[
                      sensors.PT100_PT1000 && "PT100/PT1000",
                      sensors.Thermocouple && "Thermocouple",
                      sensors.Thermistor && "Thermistor",
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                )}

                {limiterEnabled && (
                  <p>
                    <strong>Thermal Limiter:</strong> Yes
                  </p>
                )}
              </div>
            )}

            {initialQty && (
              <p>
                <strong>Initial Quantity:</strong> {initialQty}
              </p>
            )}

            {annualQty && (
              <p>
                <strong>Est. Annual Quantity:</strong> {annualQty}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
