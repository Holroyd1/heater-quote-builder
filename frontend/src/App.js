import React, { useState } from "react";

function App() {
  const [page, setPage] = useState(1);

  // --- Page 1 States ---
  const [volts, setVolts] = useState("");
  const [watts, setWatts] = useState("");
  const [width, setWidth] = useState("200");
  const [length, setLength] = useState("200");
  const [diameter, setDiameter] = useState("200");
  const [innerDiameter, setInnerDiameter] = useState("100");
  const [shape, setShape] = useState("Rectangle");
  const [connectionType, setConnectionType] = useState("Cable");
  const [connectionLength, setConnectionLength] = useState("");
  const [terminationPos, setTerminationPos] = useState("1-bottom"); // NEW

  // --- Page 2 States ---
  const [fixingAdhesive, setFixingAdhesive] = useState("No");
  const [sensors, setSensors] = useState({
    PT100: false,
    Thermocouple: false,
    Thermistor: false,
  });
  const selectedSensors = Object.keys(sensors).filter((key) => sensors[key]);
  const [limiterEnabled, setLimiterEnabled] = useState(false);
  const [foam, setFoam] = useState("None");
  const [initialQty, setInitialQty] = useState("");
  const [annualQty, setAnnualQty] = useState("");
  const [notes, setNotes] = useState("");

  // --- Numeric conversions ---
  const widthNum = parseFloat(width) || 0;
  const lengthNum = parseFloat(length) || 0;
  const diameterNum = parseFloat(diameter) || 0;
  const innerDiameterNum = parseFloat(innerDiameter) || 0;
  const voltsNum = parseFloat(volts) || 0;
  const wattsNum = parseFloat(watts) || 0;
  const connectionLengthNum = parseFloat(connectionLength) || 0;

  // --- Reset helper for Page 1 ---
  const clearPage1 = () => {
    setVolts("");
    setWatts("");
    setWidth("200");
    setLength("200");
    setDiameter("200");
    setInnerDiameter("100");
    setShape("Rectangle");
    setConnectionType("Cable");
    setConnectionLength("0.3");
    setTerminationPos("1-bottom");

    setFixingAdhesive("No");
    setSensors({ PT100: false, Thermocouple: false, Thermistor: false });
    setLimiterEnabled(false);
    setFoam("None");
    setInitialQty("");
    setAnnualQty("");
    setNotes("");

    setPage(1);
  };

  // --- Reset helper for Page 2 ---
  const clearPage2 = () => {
    setVolts("");
    setWatts("");
    setWidth("200");
    setLength("200");
    setDiameter("200");
    setInnerDiameter("100");
    setShape("Rectangle");
    setConnectionType("Cable");
    setConnectionLength("0.3");
    setTerminationPos("1-bottom");

    setFixingAdhesive("No");
    setSensors({ PT100: false, Thermocouple: false, Thermistor: false });
    setLimiterEnabled(false);
    setFoam("None");
    setInitialQty("");
    setAnnualQty("");
    setNotes("");

    setPage(1);
  };

  // --- Power Density ---
  let areaMM = 0;
  if (shape === "Rectangle") areaMM = widthNum * lengthNum;
  if (shape === "Circle") areaMM = Math.PI * Math.pow(diameterNum / 2, 2);
  if (shape === "Donut")
    areaMM =
      Math.PI *
      (Math.pow(diameterNum / 2, 2) - Math.pow(innerDiameterNum / 2, 2));
  const areaCM = areaMM / 100;
  const wattDensity = areaMM && wattsNum ? (wattsNum / areaCM).toFixed(2) : 0;

  // --- Preview Scaling (only relevant for non-attachment shapes) ---
  const maxPreview = 300;
  const minScale = 0.05;
  let scale = 1;
  if (shape === "Rectangle") {
    const largest = Math.max(widthNum, lengthNum);
    scale = Math.min(maxPreview / largest, 1);
  } else if (shape === "Circle" || shape === "Donut") {
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

  // Donut mid-radius
  const heaterW = Math.max(previewWidth, 20);
  const heaterH = Math.max(previewHeight, 20);
  const centerX = heaterW / 2;
  const centerY = heaterH / 2;
  const outerRpx = (diameterNum / 2) * scale;
  const innerRpx = (innerDiameterNum / 2) * scale;
  const midRpx = innerRpx + (outerRpx - innerRpx) / 2;
  const donutLimiterLeftPx = centerX + midRpx;

  const row = {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    margin: "6px 0",
  };
  const slider = { flex: 1 };

  // Side-view foam thickness (visual only)
  const foamPx =
    foam !== "None"
      ? 6 + parseInt(foam, 10) * 1.5 - Math.min(parseInt(foam, 10), 8) * 0.4
      : 0;

  // Helper to describe termination in email / summary
  const terminationLabel =
  terminationPos === "1-bottom"
    ? "Middle of Width"
    : terminationPos === "2-left"
    ? "Middle of Length"
    : "Custom";

  return (
    <div
      style={{
        fontFamily: "Arial",
        position: "relative",
        paddingTop: "84px",
      }}
    >
      <style>{`
  html {
    overflow-y: scroll;
  }

  .range-red { accent-color: #E50520; }

  .range-red {
    -webkit-appearance: none;
    appearance: none;
    width: 100%;
    background: transparent;
  }

  .range-red::-webkit-slider-runnable-track {
    height: 4px;
    background: #f3c2c2;
    border-radius: 2px;
  }
  .range-red::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 16px;
    height: 16px;
    margin-top: -6px;
    border-radius: 50%;
    background: #E50520;
    border: 2px solid #b21b1b;
    cursor: pointer;
  }

  .range-red::-moz-range-track {
    height: 4px;
    background: #f3c2c2;
    border-radius: 2px;
  }
  .range-red::-moz-range-thumb {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #E50520;
    border: 2px solid #b21b1b;
    cursor: pointer;
  }

  .range-red::-ms-track {
    height: 4px;
    background: transparent;
    border-color: transparent;
    color: transparent;
  }
  .range-red::-ms-fill-lower,
  .range-red::-ms-fill-upper {
    background: #f3c2c2;
    border-radius: 2px;
  }
  .range-red::-ms-thumb {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #E50520;
    border: 2px solid #b21b1b;
    cursor: pointer;
  }
@media (max-width: 900px) {
  .main-layout {
    flex-direction: column !important;
    align-items: center !important;
  }

  .left-panel,
  .right-panel {
    width: 100% !important;
    padding-right: 0 !important;
  }
}
`}</style>

      {/* --- Step Bar --- */}
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
                    backgroundColor:
                      page === step.num ? "#E50520" : "#cfcfcf",
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
                    backgroundColor:
                      page >= arr[idx + 1].num ? "#E50520" : "#cfcfcf",
                  }}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

     {/* --- Centered Layout --- */}
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
  {/* --- LEFT SIDE --- */}
  <div className="left-panel" style={{ flex: 1.2, paddingRight: 20 }}>
    {/* === PAGE 1 === */}
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

              {/* Dimensions Card */}
              <div
                style={{
                  backgroundColor: "white",
                  borderRadius: "10px",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
                  padding: "20px",
                  marginBottom: "24px",
                }}
              >
                <h3 style={{ color: "#E50520", marginBottom: "12px" }}>
                  Dimensions
                </h3>

                {/* Shape Selector (now includes Attachment) */}
                <div style={{ marginBottom: "14px" }}>
                  {["Rectangle", "Circle", "Donut", "Attachment"].map(
                    (option) => (
                      <label key={option} style={{ marginRight: "15px" }}>
                        <input
                          type="radio"
                          name="shape"
                          checked={shape === option}
                          onChange={() => setShape(option)}
                        />
                        <span style={{ marginLeft: "5px" }}>{option}</span>
                      </label>
                    )
                  )}
                </div>

                {/* Info text for Attachment */}
                {shape === "Attachment" && (
                  <p
                    style={{
                      fontSize: "13px",
                      color: "#555",
                      marginTop: "6px",
                    }}
                  >
                    For attachments, dimensions here are not required.
                    Please upload or describe your drawing in the Contact
                    Information step.
                  </p>
                )}

                {/* Rectangle Controls */}
                {shape === "Rectangle" && (
                  <>
                    <div
                      style={{
                        marginBottom: "4px",
                        fontSize: "12px",
                        color: "#666",
                      }}
                    >
                      Max Width 940mm
                    </div>
                    <label style={{ fontWeight: "bold" }}>Width (mm):</label>
                    <div style={row}>
                      <input
                        type="range"
                        className="range-red"
                        max="940"
                        value={width}
                        onChange={(e) => setWidth(e.target.value)}
                        style={slider}
                      />
                      <input
                        type="number"
                        value={width}
                        max="940"
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
                        marginBottom: "4px",
                        marginTop: "14px",
                        fontSize: "12px",
                        color: "#666",
                      }}
                    >
                      Max Length 3000mm
                    </div>
                    <label style={{ fontWeight: "bold" }}>Length (mm):</label>
                    <div style={row}>
                      <input
                        type="range"
                        className="range-red"
                        max="3000"
                        value={length}
                        onChange={(e) => setLength(e.target.value)}
                        style={slider}
                      />
                      <input
                        type="number"
                        value={length}
                        max="3000"
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

                {/* Circle Controls */}
                {shape === "Circle" && (
                  <div style={row}>
                    <label style={{ width: 110, fontWeight: "bold" }}>
                      Diameter (mm):
                    </label>
                    <input
                      type="range"
                      className="range-red"
                      max="940"
                      value={diameter}
                      onChange={(e) => setDiameter(e.target.value)}
                      style={slider}
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

                {/* Donut Controls */}
                {shape === "Donut" && (
                  <>
                    <div style={row}>
                      <label style={{ width: 110, fontWeight: "bold" }}>
                        Outer Dia. (mm):
                      </label>
                      <input
                        type="range"
                        className="range-red"
                        max="940"
                        value={diameter}
                        onChange={(e) => {
                          const d = parseFloat(e.target.value);
                          setDiameter(e.target.value);
                          if (d <= innerDiameterNum)
                            setInnerDiameter((d - 10).toString());
                        }}
                        style={slider}
                      />
                      <input
                        type="text"
                        value={diameter}
                        onChange={(e) => {
                          const d = parseFloat(e.target.value);
                          setDiameter(e.target.value);
                          if (d <= innerDiameterNum)
                            setInnerDiameter((d - 10).toString());
                        }}
                        style={{
                          width: "90px",
                          padding: "6px",
                          borderRadius: "6px",
                          border: "1px solid #ccc",
                        }}
                      />
                    </div>

                    <div style={row}>
                      <label style={{ width: 110, fontWeight: "bold" }}>
                        Inner Dia. (mm):
                      </label>
                      <input
                        type="range"
                        className="range-red"
                        max={diameter - 10}
                        value={innerDiameter}
                        onChange={(e) => setInnerDiameter(e.target.value)}
                        style={slider}
                      />
                      <input
                        type="text"
                        value={innerDiameter}
                        onChange={(e) => setInnerDiameter(e.target.value)}
                        style={{
                          width: "90px",
                          padding: "6px",
                          borderRadius: "6px",
                          border: "1px solid #ccc",
                        }}
                      />
                    </div>
                  </>
                )}
              </div>

              {/* === ATTACHMENT UPLOAD (only when Attachment shape is selected) === */}
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
                  <h3 style={{ color: "#E50520", marginBottom: "12px" }}>
                    Upload Attachment
                  </h3>

                  <p
                    style={{
                      fontSize: "13px",
                      color: "#555",
                      marginBottom: "12px",
                    }}
                  >
                    Upload your drawing, sketch, technical file, or PDF.
                  </p>

                  <input
                    type="file"
                    name="attachment"
                    accept=".pdf,.png,.jpg,.jpeg,.gif,.svg"
                    style={{ marginTop: "8px" }}
                  />

                  <p
                    style={{
                      marginTop: "10px",
                      fontSize: "12px",
                      color: "#777",
                    }}
                  >
                    This file will be submitted with your enquiry.
                  </p>
                </div>
              )}

              {/* Power Card */}
              <div
                style={{
                  backgroundColor: "white",
                  borderRadius: "10px",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
                  padding: "20px",
                  marginBottom: "24px",
                }}
              >
                <h3 style={{ color: "#E50520", marginBottom: "12px" }}>
                  Electrical Configuration
                </h3>

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
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <label
                      style={{
                        width: 100,
                        fontWeight: "bold",
                        color: "#333",
                      }}
                    >
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
                        border: "1px solid #ccc",
                        borderRadius: "6px",
                        fontSize: "14px",
                      }}
                    />
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <label
                      style={{
                        width: 100,
                        fontWeight: "bold",
                        color: "#333",
                      }}
                    >
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
                        border: "1px solid #ccc",
                        borderRadius: "6px",
                        fontSize: "14px",
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
      color: "#333",
      fontWeight: "bold",
      fontSize: "15px",
    }}
  >
    Power Density: {wattDensity} W/cm²
  </div>
)}
              </div>

              {/* Connection Card */}
              <div
                style={{
                  backgroundColor: "white",
                  borderRadius: "10px",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
                  padding: "20px",
                  marginBottom: "24px",
                }}
              >
                <h3 style={{ color: "#E50520", marginBottom: "12px" }}>
                  Connection Type
                </h3>

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
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    marginTop: "10px",
                  }}
                >
                  <label style={{ width: 180, fontWeight: "bold" }}>
                    Connection Length (metres):
                  </label>
                  <input
                    type="text"
                    value={connectionLength}
                    onChange={(e) => setConnectionLength(e.target.value)}
                    style={{
                      width: "90px",
                      padding: "6px",
                      border: "1px solid #ccc",
                      borderRadius: "6px",
                    }}
                  />
                </div>
              </div>

              {/* Termination Position Card */}
              <div
                style={{
                  backgroundColor: "white",
                  borderRadius: "10px",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
                  padding: "20px",
                  marginBottom: "24px",
                }}
              >
                <h3 style={{ color: "#E50520", marginBottom: "12px" }}>
                  Termination Position
                </h3>

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

          {/* === PAGE 2 === */}
          {page === 2 && (
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
                Add-Ons
              </h1>

              {/* Add-Ons Card */}
              <div
                style={{
                  backgroundColor: "white",
                  borderRadius: "10px",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
                  padding: "20px",
                  marginBottom: "24px",
                }}
              >
                {/* Self Adhesive */}
                <div style={{ marginBottom: "20px" }}>
                  <h3 style={{ color: "#E50520", marginBottom: "8px" }}>
                    Self Adhesive
                  </h3>
                  {["Yes", "No"].map((option) => (
                    <label key={option} style={{ marginRight: "20px" }}>
                      <input
                        type="radio"
                        name="adhesive"
                        checked={fixingAdhesive === option}
                        onChange={() => setFixingAdhesive(option)}
                      />{" "}
                      {option}
                    </label>
                  ))}
                </div>

                {/* Sensors */}
                <div style={{ marginBottom: "20px" }}>
                  <h3 style={{ color: "#E50520", marginBottom: "8px" }}>
                    Sensors
                  </h3>

                  <label style={{ marginRight: 10 }}>
                    <input
                      type="checkbox"
                      checked={sensors.PT100}
                      onChange={() =>
                        setSensors({
                          ...sensors,
                          PT100: !sensors.PT100,
                        })
                      }
                    />{" "}
                    PT100
                  </label>

                  <label style={{ marginRight: 10 }}>
                    <input
                      type="checkbox"
                      checked={sensors.Thermocouple}
                      onChange={() =>
                        setSensors({
                          ...sensors,
                          Thermocouple: !sensors.Thermocouple,
                        })
                      }
                    />{" "}
                    Thermocouple
                  </label>

                  <label>
                    <input
                      type="checkbox"
                      checked={sensors.Thermistor}
                      onChange={() =>
                        setSensors({
                          ...sensors,
                          Thermistor: !sensors.Thermistor,
                        })
                      }
                    />{" "}
                    Thermistor
                  </label>
                </div>

                {/* Thermal Limiter */}
                <div style={{ marginBottom: "20px" }}>
                  <h3 style={{ color: "#E50520", marginBottom: "8px" }}>
                    Thermal Limiter
                  </h3>

                  {["Yes", "No"].map((option) => (
                    <label key={option} style={{ marginRight: "20px" }}>
                      <input
                        type="radio"
                        name="limiter"
                        checked={limiterEnabled === (option === "Yes")}
                        onChange={() => setLimiterEnabled(option === "Yes")}
                      />{" "}
                      {option}
                    </label>
                  ))}
                </div>

                {/* Thermal Insulation */}
                <div>
                  <h3 style={{ color: "#E50520", marginBottom: "8px" }}>
                    Thermal Insulation
                  </h3>
                  {["None", "3mm", "5mm", "8mm", "12mm"].map((f) => (
                    <label key={f} style={{ marginRight: 12 }}>
                      <input
                        type="radio"
                        name="foam"
                        checked={foam === f}
                        onChange={() => setFoam(f)}
                      />{" "}
                      {f === "None" ? "None" : f}
                    </label>
                  ))}
                </div>
              </div>

              {/* Quantity Card */}
              <div
                style={{
                  backgroundColor: "white",
                  borderRadius: "10px",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
                  padding: "20px",
                  marginBottom: "24px",
                }}
              >
                <h3 style={{ color: "#E50520", marginBottom: "12px" }}>
                  Quantity Requirements
                </h3>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    marginBottom: "12px",
                  }}
                >
                  <label style={{ width: 190, fontWeight: "bold" }}>
                    Initial Quantity:
                  </label>

                  <input
                    type="text"
                    inputMode="numeric"
                    value={initialQty}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      setInitialQty(value);
                    }}
                    style={{
                      width: 120,
                      padding: "6px",
                      borderRadius: "6px",
                      border: "1px solid #ccc",
                    }}
                  />
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <label style={{ width: 190, fontWeight: "bold" }}>
                    Est. Annual Quantity (optional):
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={annualQty}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      setAnnualQty(value);
                    }}
                    style={{
                      width: 120,
                      padding: "6px",
                      borderRadius: "6px",
                      border: "1px solid #ccc",
                    }}
                  />
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  marginTop: "20px",
                }}
              >
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

          {/* === PAGE 3 === */}
          {page === 3 && (
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
                Contact Information
              </h1>

              <form
  action="https://formspree.io/f/xzzybgol"
  method="POST"
  encType="multipart/form-data"
  style={{
    backgroundColor: "white",
    borderRadius: "10px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
    padding: "20px",
    width: "85%",
  }}
>
                <input
  type="hidden"
  name="message"
  value={`
==============================
 FLEXIBLE HEATER CONFIGURATION
==============================

------------------------------
 1) DIMENSIONS
------------------------------
Shape: ${shape}
${
  shape === "Rectangle"
    ? `Width: ${widthNum} mm\nLength: ${lengthNum} mm`
    : ""
}
${shape === "Circle" ? `Diameter: ${diameterNum} mm` : ""}
${
  shape === "Donut"
    ? `Outer Diameter: ${diameterNum} mm\nInner Diameter: ${innerDiameterNum} mm`
    : ""
}
${
  shape === "Attachment"
    ? "Attachment: Customer will provide drawing / file separately."
    : ""
}

------------------------------
 2) POWER
------------------------------
Voltage: ${voltsNum} V
Wattage: ${wattsNum} W
${shape !== "Attachment" ? `Power Density: ${wattDensity} W/cm²` : ""}

------------------------------
 3) CONNECTION
------------------------------
Type: ${connectionType}
Length: ${connectionLengthNum.toFixed(1)} m
Termination Position: ${terminationLabel}

------------------------------
 4) ADD-ONS
------------------------------
Self-Adhesive: ${fixingAdhesive}
Thermal Insulation: ${foam}
Sensors: ${selectedSensors.length > 0 ? selectedSensors.join(", ") : "None"}
Thermal Limiter: ${limiterEnabled ? "Yes" : "No"}

------------------------------
 5) QUANTITY REQUIREMENTS
------------------------------
Initial Quantity: ${initialQty || "Not specified"}
Estimated Annual Quantity: ${annualQty || "Not specified"}

------------------------------
 6) CUSTOMER NOTES
------------------------------
${notes || "None"}
        `}
/>

                <div style={{ marginTop: 10 }}>
                  <h3 style={{ color: "#E50520" }}>Name:</h3>
                  <input
                    type="text"
                    name="name"
                    placeholder="Your name"
                    required
                    style={{ width: "100%", padding: "8px" }}
                  />
                </div>

                <div style={{ marginTop: 10 }}>
                  <h3 style={{ color: "#E50520" }}>Company:</h3>
                  <input
                    type="text"
                    name="company"
                    placeholder="Your company"
                    style={{ width: "100%", padding: "8px" }}
                  />
                </div>

                <div style={{ marginTop: 10 }}>
                  <h3 style={{ color: "#E50520" }}>Email:</h3>
                  <input
                    type="email"
                    name="email"
                    placeholder="Your email"
                    required
                    style={{ width: "100%", padding: "8px" }}
                  />
                </div>

                <div style={{ marginTop: 10 }}>
                  <h3 style={{ color: "#E50520" }}>Phone:</h3>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Your phone number"
                    style={{ width: "100%", padding: "8px" }}
                  />
                </div>

                <div style={{ marginTop: 10 }}>
                  <h3 style={{ color: "#E50520" }}>Additional Notes:</h3>
                  <textarea
                    placeholder="Enter any special requirements..."
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
                </div>
<div style={{ marginTop: 10 }}>
  <h3 style={{ color: "#E50520" }}>Attachment (optional):</h3>
  <input
    type="file"
    name="extraAttachment"
    accept=".pdf,.png,.jpg,.jpeg,.gif,.svg"
    style={{ width: "100%", padding: "6px" }}
  />
</div>


                <div
                  style={{
                    marginTop: "30px",
                    display: "flex",
                    gap: "10px",
                  }}
                >
                  <button
                    type="button"
                    style={{
                      padding: "10px 20px",
                      backgroundColor: "#1976d2",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                    }}
                    onClick={() => setPage(2)}
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

        {/* --- RIGHT SIDE (Preview + Summary) --- */}
        <div
          style={{
            flex: 1,
            textAlign: "center",
            backgroundColor: "#f9f9f9",
            padding: "20px",
            borderRadius: "8px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <h3
            style={{
              marginBottom: "20px",
              marginTop: "10px",
            }}
          >
            Preview
          </h3>

          {/* === PREVIEW AREA === */}
          {shape !== "Attachment" ? (
            /* Normal heater preview */
            <div
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
              {/* Heater + Dimensions Wrapper */}
              <div
                style={{
                  position: "relative",
                  width: previewWidth,
                  height: previewHeight,
                }}
              >
                {/* Heater Body */}
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    backgroundColor:
                      shape === "Donut" ? "transparent" : heaterColor,
                    borderRadius:
                      shape === "Circle" || shape === "Donut"
                        ? "50%"
                        : "0px",
                    position: "relative",
                    boxShadow:
                      shape === "Donut"
                        ? `inset 0 0 0 ${
                            (innerDiameterNum * scale) / 2
                          }px ${heaterColor}`
                        : "none",
                    border:
                      shape === "Donut"
                        ? `2px solid ${heaterColor}`
                        : "none",
                  }}
                >
                  {/* Patches (hidden by foam) */}
                  {!foamActive && (
                    <>
                      {/* Sensors */}
                      {selectedSensors.length > 0 &&
                        selectedSensors.map((sensor, index) => {
                          const total = selectedSensors.length;
                          const offset =
                            (index - (total - 1) / 2) *
                            (patchWidth * 1.2);

                          if (shape === "Donut") {
                            const angle =
                              (index / total) * Math.PI -
                              Math.PI / 2;
                            const x =
                              centerX + Math.cos(angle) * midRpx;
                            const y =
                              centerY + Math.sin(angle) * midRpx;

                            return (
                              <div
                                key={sensor}
                                style={{
                                  position: "absolute",
                                  width: patchWidth * 0.8,
                                  height: patchHeight * 0.8,
                                  backgroundColor: "#b22222",
                                  left: x,
                                  top: y,
                                  transform:
                                    "translate(-50%, -50%)",
                                  border: "1px solid #800000",
                                  borderRadius: "2px",
                                  zIndex: 3,
                                }}
                              />
                            );
                          }

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
                                transform:
                                  "translate(-50%, -50%)",
                                border: "1px solid #800000",
                                borderRadius: "2px",
                                zIndex: 3,
                              }}
                            />
                          );
                        })}

                     {/* Thermal Limiter */}
{limiterEnabled &&
  (shape === "Donut" ? (
    // Donut version stays unchanged
    <div
      style={{
        position: "absolute",
        width: patchWidth * 0.9,
        height: patchWidth * 0.9,
        borderRadius: "50%",
        backgroundColor: "#b22222",
        border: "1px solid #800000",
        left: `${donutLimiterLeftPx}px`,
        top: `${centerY}px`,
        transform: "translate(-50%, -50%)",
        zIndex: 3,
      }}
    />
  ) : terminationPos === "2-left" ? (
    // NEW POSITION — when termination is on the left side
    <div
      style={{
        position: "absolute",
        width: patchWidth * 0.9,
        height: patchWidth * 0.9,
        borderRadius: "50%",
        backgroundColor: "#b22222",
        border: "1px solid #800000",
        top: "50%",
        left: patchWidth + 4 * scale,   // → just inside the heater, behind termination patch
        transform: "translateY(-50%)",
        zIndex: 2,                      // behind the termination patch
      }}
    />
  ) : (
    // DEFAULT position (Option 1 & Other)
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
  ))}

                      {/* Termination patch - Position 1 (Bottom Centre) */}
                      {terminationPos === "1-bottom" && (
                        <div
                          style={{
                            position: "absolute",
                            width: patchWidth,
                            height: patchHeight,
                            backgroundColor: "#b22222",
                            left: "50%",
                            bottom:
                              (patchWidth - patchHeight) / 2,
                            transform:
                              "translateX(-50%) rotate(90deg)",
                            border: "1px solid #800000",
                            zIndex: 2,
                          }}
                        />
                      )}

{/* Termination patch - Position 2 (Left Side Middle) */}
{terminationPos === "2-left" && (
  <div
    style={{
      position: "absolute",
      width: patchWidth,
      height: patchHeight,
      backgroundColor: "#b22222",
      top: "50%",
      left: 0, // flush with the left edge, fully inside
      transform: "translateY(-50%) rotate(180deg)",
      border: "1px solid #800000",
      zIndex: 2,
    }}
  />
)}
                    </>
                  )}

                  {/* CABLE / LEADS (POSITION 1: Bottom Centre) */}
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
                                leadSpacing / 2 +
                                leadThickness / 2
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
                                leadSpacing / 2 -
                                leadThickness / 2
                              }px)`,
                              zIndex: 4,
                            }}
                          />
                        </>
                      )}
                    </>
                  )}

                  {/* CABLE / LEADS (POSITION 2: Left Side Middle) */}
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
            transform: `translateY(calc(-50% - ${leadSpacing / 2}px))`,
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
            transform: `translateY(calc(-50% + ${leadSpacing / 2}px))`,
            zIndex: 4,
          }}
        />
      </>
    )}
  </>
)}
                  {/* If terminationPos === "other", no cables/leads are rendered */}
                </div>

                {/* Rectangle dimension lines */}
                {shape === "Rectangle" && (
                  <>
                    {/* Width label */}
<div
  style={{
    position: "absolute",
    top: -32,
    left: "50%",
    transform: "translateX(-50%)",
    fontSize: "12px",
    fontWeight: "bold",
    whiteSpace: "nowrap",     // ← prevents wrapping
    display: "inline-block",  // ← ensures single-line rendering
  }}
>
  {widthNum} mm
</div>


                    {/* Width line */}
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

                    {/* Width ticks */}
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

                    {/* Length label */}
                    <div
                      style={{
                        position: "absolute",
                        left: previewWidth + 5,
                        top: "50%",
                        transform:
                          "translateY(-50%) rotate(90deg)",
                        fontSize: "12px",
                        fontWeight: "bold",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {lengthNum} mm
                    </div>

                    {/* Length line */}
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

                    {/* Length ticks */}
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

                {/* Circle / donut labels */}
                {shape === "Circle" && (
                  <div
                    style={{
                      position: "absolute",
                      top: -24,
                      left: "50%",
                      transform: "translateX(-50%)",
whiteSpace: "nowrap",
display: "inline-block",
                      fontSize: "12px",
                      fontWeight: "bold",
                    }}
                  >
                    Ø {diameterNum} mm
                  </div>
                )}
                {shape === "Donut" && (
                  <div
                    style={{
                      position: "absolute",
                      top: -24,
                      left: "50%",
                      transform: "translateX(-50%)",
whiteSpace: "nowrap",
display: "inline-block",
                      fontSize: "12px",
                      fontWeight: "bold",
                    }}
                  >
                    Ø {diameterNum}/{innerDiameterNum} mm
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Attachment placeholder */
            <div
              style={{
                width: "100%",
                minHeight: 160,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#ececec",
                borderRadius: "8px",
                marginBottom: 20,
                padding: 20,
                color: "#666",
                fontSize: "14px",
              }}
            >
              🔒 Preview disabled in Attachment mode
            </div>
          )}

          {/* Connection Length label */}
          <div
            style={{
              fontSize: "14px",
              color: "#333",
              fontWeight: "bold",
            }}
          >
            Connection Length: {connectionLengthNum.toFixed(1)} m
          </div>

          {/* SIDE VIEW */}
          <div
            style={{
              marginTop: "30px",
              textAlign: "center",
            }}
          >
            {foam !== "None" && (
              <div
                style={{
                  color: "#000",
                  fontSize: "14px",
                  marginBottom: "10px",
                }}
              >
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
                boxSizing: "border-box",
              }}
            >
              {/* Contact patch only when no foam */}
              {foam === "None" && (
                <div
                  style={{
                    position: "absolute",
                    Left: 0,
                    top: "-5px",
                    width: 18,
                    height: 5,
                    backgroundColor: "#8B0000",
                    zIndex: 2,
                  }}
                />
              )}

              {/* Lead always visible */}
              <div
  style={{
    position: "absolute",
    left: -40,   // moved further left
    top: foam === "None" ? "-2px" : `${foamPx - 2}px`,
    width: 40,
    height: 3,
    backgroundColor: "black",
    zIndex: 1,
  }}
/>

              {/* Foam layer */}
              {foam !== "None" && (
                <div
                  style={{
                    height: foamPx,
                    width: "100%",
                    backgroundColor: "#d3d3d3",
                    boxSizing: "border-box",    top: foam === "None" ? "-2px" : `${foamPx - 2}px`,

                  }}
                />
              )}

              {/* Heater core */}
              <div
                style={{
                  height: 3,
                  width: "100%",
                  backgroundColor: "#8B0000",
                  boxSizing: "border-box",
                }}
              />

              {/* Adhesive */}
              {fixingAdhesive === "Yes" && (
                <div
                  style={{
                    height: 2,
                    width: "100%",
                    backgroundColor: "#b38f5a",
                    boxSizing: "border-box",
                  }}
                />
              )}
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
          </div>

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
              width: "95%",
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

            {shape === "Donut" && (
              <p>
                <strong>Size:</strong> Ø {diameterNum}/{innerDiameterNum} mm
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
            <p>
              <strong>Power Density:</strong> {wattDensity} W/cm²
            </p>
            <p>
              <strong>Connection:</strong> {connectionType} (
              {connectionLengthNum.toFixed(1)} m)
            </p>
            <p>
              <strong>Termination:</strong> {terminationLabel}
            </p>
            <p>
              <strong>Adhesive:</strong> {fixingAdhesive}
            </p>

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

            {(foam !== "None" ||
              sensors.PT100 ||
              sensors.Thermocouple ||
              sensors.Thermistor ||
              limiterEnabled) && (
              <>
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

                {(sensors.PT100 ||
                  sensors.Thermocouple ||
                  sensors.Thermistor) && (
                  <p>
                    <strong>Sensors:</strong>{" "}
                    {[
                      sensors.PT100 && "PT100",
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
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
