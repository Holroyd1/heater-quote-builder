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
  const [connectionLength, setConnectionLength] = useState("0.3");

  // --- Page 2 States ---
  const [fixingAdhesive, setFixingAdhesive] = useState("No");
  const [sensors, setSensors] = useState({ PT100: false, J: false, K: false });
  const [limiterEnabled, setLimiterEnabled] = useState(false);
  const [limiterTemp, setLimiterTemp] = useState("");
  const [foam, setFoam] = useState("None");
  const [initialQty, setInitialQty] = useState("");
  const [annualQty, setAnnualQty] = useState("");

  // --- Numeric conversions ---
  const widthNum = parseFloat(width) || 0;
  const lengthNum = parseFloat(length) || 0;
  const diameterNum = parseFloat(diameter) || 0;
  const innerDiameterNum = parseFloat(innerDiameter) || 0;
  const voltsNum = parseFloat(volts) || 0;
  const wattsNum = parseFloat(watts) || 0;
  const connectionLengthNum = parseFloat(connectionLength) || 0;

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

  // --- Preview Scaling ---
  const maxPreview = 300;
  const minScale = 0.05;
  let scale = 1;
  if (shape === "Rectangle") {
    const largest = Math.max(widthNum, lengthNum);
    scale = Math.min(maxPreview / largest, 1);
  } else {
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

  const heaterColor = foam === "None" ? "#8B0000" : "gray";
  const foamActive = foam !== "None";

  // --- Donut mid-radius placement (in preview pixels) ---
  const heaterW = Math.max(previewWidth, 20);
  const heaterH = Math.max(previewHeight, 20);
  const centerX = heaterW / 2;
  const centerY = heaterH / 2;

  // Outer/inner radius in preview px (for donut)
  const outerRpx = (diameterNum / 2) * scale;         // equals previewWidth/2
  const innerRpx = (innerDiameterNum / 2) * scale;
  const midRpx = innerRpx + (outerRpx - innerRpx) / 2;

  // Positions for donut patches (left/right on mid-radius)
  const donutSensorLeftPx = centerX - midRpx;
  const donutLimiterLeftPx = centerX + midRpx;

  const row = { display: "flex", alignItems: "center", gap: "10px", margin: "6px 0" };
  const slider = { flex: 1 };

  return (
    <div style={{ fontFamily: "Arial", position: "relative", paddingTop: "84px" }}>
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
                style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    backgroundColor: page === step.num ? "#1976d2" : "#cfcfcf",
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
                    color: page === step.num ? "#1976d2" : "#666",
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
                      page >= arr[idx + 1].num ? "#1976d2" : "#cfcfcf",
                  }}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* --- Centered Layout --- */}
      <div
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
        <div style={{ flex: 1.2, paddingRight: 20 }}>
          {/* === PAGE 1 === */}
          {page === 1 && (
            <>
              <h1>Dimensions & Power</h1>
              <h3>Material:</h3>
              <button
                style={{
                  backgroundColor: "#1976d2",
                  color: "white",
                  border: "none",
                  padding: "10px 20px",
                  borderRadius: "4px",
                  marginBottom: "20px",
                }}
              >
                SILICONE
              </button>

              {/* Power */}
              <div>
                <h3>Power:</h3>
                <div style={row}>
                  <label style={{ width: 90 }}>Voltage:</label>
                  <input type="number" value={volts} onChange={(e) => setVolts(e.target.value)} style={{ width: 90 }} />
                </div>
                <div style={row}>
                  <label style={{ width: 90 }}>Wattage:</label>
                  <input type="number" value={watts} onChange={(e) => setWatts(e.target.value)} style={{ width: 90 }} />
                </div>
                <p style={{ color: "gray", marginTop: "14px" }}>{wattDensity} watts/cm²</p>
                {wattDensity > 0.8 && <p style={{ color: "red", fontWeight: "bold" }}>⚠ This power exceeds our recommended maximum.</p>}
              </div>

              <div style={{ marginBottom: "14px" }}>
                <h3>Dimensions:</h3>
                {["Rectangle", "Circle", "Donut"].map((option) => (
                  <div key={option}>
                    <input type="radio" id={option} name="shape" checked={shape === option} onChange={() => setShape(option)} />
                    <label htmlFor={option} style={{ marginLeft: "5px" }}>{option}</label>
                  </div>
                ))}
              </div>

              {/* Rectangle */}
              {shape === "Rectangle" && (
                <>
                  <label>Width (mm):</label>
                  <div style={row}>
                    <input
                      type="range"
                      max="940"
                      value={width}
                      onChange={(e) => {
                        const w = parseFloat(e.target.value);
                        setWidth(e.target.value);
                        if (w > parseFloat(length)) setLength(e.target.value);
                      }}
                      style={slider}
                    />
                    <input
                      type="number"
                      value={width}
                      onChange={(e) => setWidth(e.target.value)}
                      onBlur={() => {
                        const w = parseFloat(width);
                        if (w > parseFloat(length)) setLength(width);
                      }}
                      style={{ width: "80px" }}
                    />
                  </div>

                  <label>Length (mm):</label>
                  <div style={row}>
                    <input
                      type="range"
                      max="3000"
                      value={length}
                      onChange={(e) => {
                        const l = parseFloat(e.target.value);
                        setLength(e.target.value);
                        if (l < parseFloat(width)) setWidth(e.target.value);
                      }}
                      style={slider}
                    />
                    <input
                      type="number"
                      value={length}
                      onChange={(e) => setLength(e.target.value)}
                      onBlur={() => {
                        const l = parseFloat(length);
                        if (l < parseFloat(width)) setWidth(length);
                      }}
                      style={{ width: "80px" }}
                    />
                  </div>
                </>
              )}

              {/* Circle */}
              {shape === "Circle" && (
                <div style={row}>
                  <label style={{ width: 110 }}>Diameter (mm):</label>
                  <input type="range" max="940" value={diameter} onChange={(e) => setDiameter(e.target.value)} style={slider} />
                  <input type="text" value={diameter} onChange={(e) => setDiameter(e.target.value)} style={{ width: 90 }} />
                </div>
              )}

              {/* Donut */}
              {shape === "Donut" && (
                <>
                  <div style={row}>
                    <label style={{ width: 110 }}>Outer Dia. (mm):</label>
                    <input
                      type="range"
                      max="940"
                      value={diameter}
                      onChange={(e) => {
                        const d = parseFloat(e.target.value);
                        setDiameter(e.target.value);
                        if (d <= innerDiameterNum) setInnerDiameter((d - 10).toString());
                      }}
                      style={slider}
                    />
                    <input
                      type="text"
                      value={diameter}
                      onChange={(e) => {
                        const d = parseFloat(e.target.value);
                        setDiameter(e.target.value);
                        if (d <= innerDiameterNum) setInnerDiameter((d - 10).toString());
                      }}
                      style={{ width: 90 }}
                    />
                  </div>
                  <div style={row}>
                    <label style={{ width: 110 }}>Inner Dia. (mm):</label>
                    <input type="range" max={diameter - 10} value={innerDiameter} onChange={(e) => setInnerDiameter(e.target.value)} style={slider} />
                    <input type="text" value={innerDiameter} onChange={(e) => setInnerDiameter(e.target.value)} style={{ width: 90 }} />
                  </div>
                </>
              )}

              {/* Connection */}
              <div style={{ marginTop: "20px" }}>
                <h3>Connection Type:</h3>
                {["Cable", "Leads"].map((type) => (
                  <div key={type}>
                    <input type="radio" id={type} name="connection" checked={connectionType === type} onChange={() => setConnectionType(type)} />
                    <label htmlFor={type} style={{ marginLeft: 6 }}>{type}</label>
                  </div>
                ))}
                <div style={row}>
                  <label>Connection Length (m):</label>
                  <input type="text" value={connectionLength} onChange={(e) => setConnectionLength(e.target.value)} style={{ width: 90 }} />
                </div>
              </div>

              <button
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#1976d2",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  marginTop: "20px",
                }}
                onClick={() => setPage(2)}
              >
                Next: Add-Ons
              </button>
            </>
          )}

          {/* === PAGE 2 === */}
          {page === 2 && (
            <>
              <h1>Add-Ons</h1>
              <div style={{ marginTop: 10 }}>
                <h3>Self Adhesive:</h3>
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

              <div style={{ marginTop: 10 }}>
                <h3>Sensors:</h3>
                <label style={{ marginRight: 10 }}>
                  <input
                    type="checkbox"
                    checked={sensors.PT100}
                    onChange={() => setSensors({ ...sensors, PT100: !sensors.PT100 })}
                  />{" "}
                  PT100
                </label>
                <label style={{ marginRight: 10 }}>
                  <input
                    type="checkbox"
                    checked={sensors.J}
                    onChange={() => setSensors({ ...sensors, J: !sensors.J })}
                  />{" "}
                  Thermocouple J
                </label>
                <label style={{ marginRight: 10 }}>
                  <input
                    type="checkbox"
                    checked={sensors.K}
                    onChange={() => setSensors({ ...sensors, K: !sensors.K })}
                  />{" "}
                  Thermocouple K
                </label>
              </div>

              <div style={{ marginTop: 10 }}>
                <h3>Limiter:</h3>
                <label>
                  <input
                    type="checkbox"
                    checked={limiterEnabled}
                    onChange={() => setLimiterEnabled(!limiterEnabled)}
                  />{" "}
                  Yes
                </label>
                {limiterEnabled && (
                  <>
                    <input
                      type="number"
                      value={limiterTemp}
                      onChange={(e) => setLimiterTemp(e.target.value)}
                      placeholder="Temperature"
                      style={{ marginLeft: 10, width: 90 }}
                    />
                    <span style={{ marginLeft: 5 }}>°C</span>
                  </>
                )}
              </div>

              <div style={{ marginTop: 10 }}>
                <h3>Foam:</h3>
                {["None", "3mm", "5mm", "8mm", "12mm"].map((f) => (
                  <label key={f} style={{ marginRight: 10 }}>
                    <input
                      type="radio"
                      name="foam"
                      checked={foam === f}
                      onChange={() => setFoam(f)}
                    />{" "}
                    {f === "None" ? "No Foam" : f}
                  </label>
                ))}
              </div>

              <div style={{ marginTop: 20 }}>
                <h3>Quantity Requirements:</h3>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                  <label style={{ width: 190 }}>Initial Quantity:</label>
                  <input type="number" value={initialQty} onChange={(e) => setInitialQty(e.target.value)} style={{ width: 120 }} />
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <label style={{ width: 190 }}>Est. Annual Quantity (optional):</label>
                  <input type="number" value={annualQty} onChange={(e) => setAnnualQty(e.target.value)} style={{ width: 120 }} />
                </div>
              </div>

              <div style={{ marginTop: "30px", display: "flex", gap: "10px" }}>
                <button
                  style={{
                    padding: "10px 20px",
                    backgroundColor: "#1976d2",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
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
                    borderRadius: "4px",
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
              <h1>Contact Information</h1>
              <div style={{ marginTop: 10 }}>
                <h3>Name:</h3>
                <input type="text" placeholder="Your name" style={{ width: "80%", padding: "8px" }} />
              </div>
              <div style={{ marginTop: 10 }}>
                <h3>Company:</h3>
                <input type="text" placeholder="Your company" style={{ width: "80%", padding: "8px" }} />
              </div>
              <div style={{ marginTop: 10 }}>
                <h3>Email:</h3>
                <input type="email" placeholder="Your email" style={{ width: "80%", padding: "8px" }} />
              </div>
              <div style={{ marginTop: 10 }}>
                <h3>Phone:</h3>
                <input type="tel" placeholder="Your phone number" style={{ width: "80%", padding: "8px" }} />
              </div>
              <div style={{ marginTop: 10 }}>
                <h3>Additional Notes:</h3>
                <textarea placeholder="Enter any special requirements..." style={{ width: "80%", height: "100px", padding: "8px" }} />
              </div>

              <div style={{ marginTop: "30px", display: "flex", gap: "10px" }}>
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
                  Back
                </button>
                <button
                  style={{
                    padding: "10px 20px",
                    backgroundColor: "green",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                  }}
                  onClick={() => alert("Quote submitted!")}
                >
                  Submit Quote
                </button>
              </div>
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
          }}
        >
          <h3 style={{ marginBottom: "40px", marginTop: "20px" }}>Flexible Heater Preview</h3>

          {/* Heater body */}
          <div style={{ position: "relative", margin: "0 auto" }}>
            <div
              style={{
                width: Math.max(previewWidth, 20),
                height: Math.max(previewHeight, 20),
                backgroundColor: shape === "Donut" ? "transparent" : heaterColor,
                borderRadius: shape === "Circle" || shape === "Donut" ? "50%" : "0px",
                margin: "0 auto",
                position: "relative",
                boxShadow:
                  shape === "Donut"
                    ? `inset 0 0 0 ${(innerDiameterNum * scale) / 2}px ${heaterColor}`
                    : "none",
                border: shape === "Donut" ? `2px solid ${heaterColor}` : "none",
              }}
            >
              {/* Patches (hidden by foam) */}
              {!foamActive && (
                <>
                  {/* Sensor patch */}
                  {(sensors.PT100 || sensors.J || sensors.K) && (
                    shape === "Donut" ? (
                      // DONUT: sensor at left mid-radius
                      <div
                        style={{
                          position: "absolute",
                          width: patchWidth * 0.8,
                          height: patchHeight * 0.8,
                          backgroundColor: "#b22222",
                          left: `${donutSensorLeftPx}px`,
                          top: `${centerY}px`,
                          transform: "translate(-50%,-50%)",
                          border: "1px solid #800000",
                          borderRadius: "2px",
                          zIndex: 3,
                        }}
                      />
                    ) : (
                      // Other shapes: centered
                      <div
                        style={{
                          position: "absolute",
                          width: patchWidth * 0.8,
                          height: patchHeight * 0.8,
                          backgroundColor: "#b22222",
                          top: "50%",
                          left: "50%",
                          transform: "translate(-50%,-50%)",
                          border: "1px solid #800000",
                          borderRadius: "2px",
                          zIndex: 3,
                        }}
                      />
                    )
                  )}

                  {/* Limiter patch (doughnut ring) */}
                  {limiterEnabled && (
                    shape === "Donut" ? (
                      // DONUT: limiter at right mid-radius
                      <div
                        style={{
                          position: "absolute",
                          width: patchWidth * 0.9,
                          height: patchWidth * 0.9,
                          borderRadius: "50%",
                          backgroundColor: "transparent",
                          boxShadow: `inset 0 0 0 ${patchWidth * 0.22}px #b22222`,
                          border: `${patchWidth * 0.03}px solid #800000`,
                          left: `${donutLimiterLeftPx}px`,
                          top: `${centerY}px`,
                          transform: "translate(-50%,-50%)",
                          zIndex: 3,
                        }}
                      />
                    ) : (
                      // Other shapes: above termination patch
                      <div
                        style={{
                          position: "absolute",
                          width: patchWidth * 0.9,
                          height: patchWidth * 0.9,
                          borderRadius: "50%",
                          backgroundColor: "transparent",
                          boxShadow: `inset 0 0 0 ${patchWidth * 0.22}px #b22222`,
                          border: `${patchWidth * 0.03}px solid #800000`,
                          bottom: patchHeight + 15,
                          left: "50%",
                          transform: "translateX(-50%)",
                          zIndex: 3,
                        }}
                      />
                    )
                  )}

                  {/* Termination patch (bottom center) */}
                  <div
                    style={{
                      position: "absolute",
                      width: patchWidth,
                      height: patchHeight,
                      backgroundColor: "#b22222",
                      bottom: 0,
                      left: "50%",
                      transform: "translateX(-50%)",
                      border: "1px solid #800000",
                      zIndex: 2,
                    }}
                  />
                </>
              )}

              {/* Cable or leads always visible */}
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
                      left: `calc(50% - ${leadSpacing / 2}px)`,
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
                      left: `calc(50% + ${leadSpacing / 2}px)`,
                      zIndex: 4,
                    }}
                  />
                </>
              )}

              {/* Labels */}
              {shape === "Rectangle" && (
                <>
                  <div style={{ position: "absolute", top: -20, left: "50%", transform: "translateX(-50%)", fontSize: "12px", fontWeight: "bold" }}>
                    {widthNum} mm
                  </div>
                  <div style={{ position: "absolute", right: -60, top: "50%", transform: "translateY(-50%)", fontSize: "12px", fontWeight: "bold" }}>
                    {lengthNum} mm
                  </div>
                </>
              )}
            </div>

            {shape === "Circle" && (
              <div style={{ position: "absolute", top: -20, left: "50%", transform: "translateX(-50%)", fontSize: "12px", fontWeight: "bold" }}>
                Ø {diameterNum} mm
              </div>
            )}
            {shape === "Donut" && (
              <div style={{ position: "absolute", top: -20, left: "50%", transform: "translateX(-50%)", fontSize: "12px", fontWeight: "bold" }}>
                Ø {diameterNum}/{innerDiameterNum} mm
              </div>
            )}

            <div style={{ marginTop: patchHeight + 40, fontSize: "12px", color: "gray" }}>
              Connection Length: {connectionLengthNum.toFixed(1)} m
            </div>

            {/* --- Summary --- */}
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
              <h4 style={{ marginBottom: "10px", color: "#1976d2" }}>Heater Summary</h4>
              <p><strong>Dimensions:</strong> {shape}</p>
              {shape === "Rectangle" && <p><strong>Size:</strong> {widthNum} mm × {lengthNum} mm</p>}
              {shape === "Circle" && <p><strong>Diameter:</strong> Ø {diameterNum} mm</p>}
              {shape === "Donut" && <p><strong>Size:</strong> Ø {diameterNum}/{innerDiameterNum} mm</p>}
              <p><strong>Power:</strong> {wattsNum} W @ {voltsNum} V</p>
              <p><strong>Power Density:</strong> {wattDensity} W/cm²</p>
              <p><strong>Connection:</strong> {connectionType} ({connectionLengthNum.toFixed(1)} m)</p>
              <p><strong>Adhesive:</strong> {fixingAdhesive}</p>

              {initialQty && <p><strong>Initial Quantity:</strong> {initialQty}</p>}
              {annualQty && <p><strong>Est. Annual Quantity:</strong> {annualQty}</p>}

              {(foam !== "None" || sensors.PT100 || sensors.J || sensors.K || limiterEnabled) && (
                <>
                  <h4 style={{ marginTop: "10px", color: "#1976d2" }}>Add-Ons</h4>
                  {foam !== "None" && <p><strong>Foam:</strong> {foam}</p>}
                  {(sensors.PT100 || sensors.J || sensors.K) && (
                    <p>
                      <strong>Sensors:</strong>{" "}
                      {[sensors.PT100 && "PT100", sensors.J && "Thermocouple J", sensors.K && "Thermocouple K"]
                        .filter(Boolean)
                        .join(", ")}
                    </p>
                  )}
                  {limiterEnabled && <p><strong>Limiter:</strong> Yes ({limiterTemp || "n/a"} °C)</p>}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
