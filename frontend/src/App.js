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
const selectedSensors = Object.keys(sensors).filter(key => sensors[key]);
  const [limiterEnabled, setLimiterEnabled] = useState(false);
  const [limiterTemp, setLimiterTemp] = useState("");
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

// --- Reset helper for Page 1 (now clears Page 1 + 2 and returns to Page 1) ---
const clearPage1 = () => {
  // Reset Page 1
  setVolts("");
  setWatts("");
  setWidth("200");
  setLength("200");
  setDiameter("200");
  setInnerDiameter("100");
  setShape("Rectangle");
  setConnectionType("Cable");
  setConnectionLength("0.3");

  // Reset Page 2
  setFixingAdhesive("No");
  setSensors({ PT100: false, J: false, K: false });
  setLimiterEnabled(false);
  setLimiterTemp("");
  setFoam("None");
  setInitialQty("");
  setAnnualQty("");

  // Return user to Page 1
  setPage(1);
};

// --- Reset helper for Page 2 (clears both Page 1 and 2, returns to Page 1) ---
const clearPage2 = () => {
  // Reset Page 1
  setVolts("");
  setWatts("");
  setWidth("200");
  setLength("200");
  setDiameter("200");
  setInnerDiameter("100");
  setShape("Rectangle");
  setConnectionType("Cable");
  setConnectionLength("0.3");

  // Reset Page 2
  setFixingAdhesive("No");
  setSensors({ PT100: false, J: false, K: false });
  setLimiterEnabled(false);
  setLimiterTemp("");
  setFoam("None");
  setInitialQty("");
  setAnnualQty("");

  // Return user to Page 1
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
  const donutLimiterLeftPx = centerX + midRpx;

  const row = { display: "flex", alignItems: "center", gap: "10px", margin: "6px 0" };
  const slider = { flex: 1 };

// Side-view helpers with diminishing visual scaling for thicker foam
const foamPx = foam !== "None"
  ? 6 + parseInt(foam, 10) * 1.5 - Math.min(parseInt(foam, 10), 8) * 0.4
  : 0;

  return (
    <div style={{ fontFamily: "Arial", position: "relative", paddingTop: "84px" }}>
    <style>{`
      /* Red slider styling */
      .range-red { accent-color: #E50520; }

      .range-red {
        -webkit-appearance: none;
        appearance: none;
        width: 100%;
        background: transparent;
      }

      /* Chrome / Edge / Safari */
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

      /* Firefox */
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

      /* Optional: legacy fallback */
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
    <h1
  style={{
    color: "#E50520",         // red to match your theme
    fontSize: "26px",         // slightly larger
    marginBottom: "20px",
    fontWeight: "bold",
    textAlign: "left",        // change to "center" if you prefer
  }}
>
  Dimensions & Power
</h1>


   {/* --- Dimensions Section --- */}
<div
  style={{
    backgroundColor: "white",
    borderRadius: "10px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
    padding: "20px",
    marginBottom: "24px",
  }}
>
  <h3 style={{ color: "#E50520", marginBottom: "12px" }}> Dimensions</h3>

  {/* Shape Selector */}
  <div style={{ marginBottom: "14px" }}>
    {["Rectangle", "Circle", "Donut"].map((option) => (
      <label key={option} style={{ marginRight: "15px" }}>
        <input
          type="radio"
          id={option}
          name="shape"
          checked={shape === option}
          onChange={() => setShape(option)}
        />
        <span style={{ marginLeft: "5px" }}>{option}</span>
      </label>
    ))}
  </div>

  {/* Rectangle Controls */}
  {shape === "Rectangle" && (
    <>
      <label style={{ fontWeight: "bold" }}>Width (mm):</label>
      <div style={row}>
        <input
  type="range"
  className="range-red"
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
          style={{
            width: "80px",
            padding: "6px",
            borderRadius: "6px",
            border: "1px solid #ccc",
          }}
        />
      </div>

      <label style={{ fontWeight: "bold" }}>Length (mm):</label>
      <div style={row}>
       <input
  type="range"
  className="range-red"
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
      <label style={{ width: 110, fontWeight: "bold" }}>Diameter (mm):</label>
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
        <label style={{ width: 110, fontWeight: "bold" }}>Outer Dia. (mm):</label>
        <input
  type="range"
  className="range-red"
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
          style={{
            width: "90px",
            padding: "6px",
            borderRadius: "6px",
            border: "1px solid #ccc",
          }}
        />
      </div>
      <div style={row}>
        <label style={{ width: 110, fontWeight: "bold" }}>Inner Dia. (mm):</label>
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

    {/* --- Power Section --- */}
<div
  style={{
    backgroundColor: "white",
    borderRadius: "10px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
    padding: "20px",
    marginBottom: "24px",
  }}
>
  <h3 style={{ color: "#E50520", marginBottom: "12px" }}> Power Configuration</h3>

  <div
    style={{
      display: "flex",
      flexDirection: "column",
      gap: "12px",
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      <label style={{ width: 100, fontWeight: "bold", color: "#333" }}>
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

    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      <label style={{ width: 100, fontWeight: "bold", color: "#333" }}>
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

  {wattDensity > 0.8 && (
    <p style={{ color: "red", fontWeight: "bold", marginTop: "10px" }}>
      ⚠ This power exceeds our recommended maximum.
    </p>
  )}
</div>

   {/* --- Connection Section --- */}
<div
  style={{
    backgroundColor: "white",
    borderRadius: "10px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
    padding: "20px",
    marginBottom: "24px",
  }}
>
  <h3 style={{ color: "#E50520", marginBottom: "12px" }}> Connection Type</h3>

  {["Cable", "Leads"].map((type) => (
    <label key={type} style={{ display: "block", marginBottom: "6px" }}>
      <input
        type="radio"
        id={type}
        name="connection"
        checked={connectionType === type}
        onChange={() => setConnectionType(type)}
      />
      <span style={{ marginLeft: "6px" }}>{type}</span>
    </label>
  ))}

  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "10px" }}>
    <label style={{ width: 180, fontWeight: "bold" }}>Connection Length (m):</label>
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
)}   {/* ← this closes the Page 1 section properly */}
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

    {/* --- Add-Ons Card --- */}
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
        <h3 style={{ color: "#E50520", marginBottom: "8px" }}>Self Adhesive</h3>
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
        <h3 style={{ color: "#E50520", marginBottom: "8px" }}>Sensors</h3>
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
        <label>
          <input
            type="checkbox"
            checked={sensors.K}
            onChange={() => setSensors({ ...sensors, K: !sensors.K })}
          />{" "}
          Thermocouple K
        </label>
      </div>

      {/* Limiter */}
      <div style={{ marginBottom: "20px" }}>
        <h3 style={{ color: "#E50520", marginBottom: "8px" }}>Limiter</h3>
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
              style={{
                marginLeft: 10,
                width: 90,
                padding: "6px",
                borderRadius: "6px",
                border: "1px solid #ccc",
              }}
            />
            <span style={{ marginLeft: 5 }}>°C</span>
          </>
        )}
      </div>

      {/* Foam */}
      <div>
        <h3 style={{ color: "#E50520", marginBottom: "8px" }}>Foam</h3>
        {["None", "3mm", "5mm", "8mm", "12mm"].map((f) => (
          <label key={f} style={{ marginRight: 12 }}>
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
    </div>

    {/* --- Quantity Requirements Card --- */}
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
          type="number"
          value={initialQty}
          onChange={(e) => setInitialQty(e.target.value)}
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
          type="number"
          value={annualQty}
          onChange={(e) => setAnnualQty(e.target.value)}
          style={{
            width: 120,
            padding: "6px",
            borderRadius: "6px",
            border: "1px solid #ccc",
          }}
        />
      </div>
    </div>

    {/* --- Navigation Buttons --- */}
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
      style={{
        backgroundColor: "white",
        borderRadius: "10px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
        padding: "20px",
        width: "85%",
      }}
    >
      {/* Single formatted message sent to Formspree */}
      <input
        type="hidden"
        name="message"
        value={`
--- DIMENSIONS ---
Shape: ${shape}
${shape === "Rectangle" ? `Width: ${widthNum} mm\nLength: ${lengthNum} mm` : ""}
${shape === "Circle" ? `Diameter: ${diameterNum} mm` : ""}
${shape === "Donut" ? `Outer Diameter: ${diameterNum} mm\nInner Diameter: ${innerDiameterNum} mm` : ""}

--- POWER ---
Voltage: ${voltsNum} V
Wattage: ${wattsNum} W
Power Density: ${wattDensity} W/cm²

--- CONNECTION ---
Type: ${connectionType}
Length: ${connectionLengthNum.toFixed(1)} m

--- ADD-ONS ---
Adhesive: ${fixingAdhesive}
Foam: ${foam}
Sensors: ${selectedSensors.length > 0 ? selectedSensors.join(", ") : "None"}
Limiter: ${limiterEnabled ? `${limiterTemp} °C` : "No"}

--- QUANTITIES ---
Initial Qty: ${initialQty || "Not specified"}
Annual Qty: ${annualQty || "Not specified"}

--- CUSTOMER NOTES ---
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
          style={{ width: "100%", height: "100px", padding: "8px" }}
        />
        {/* ⬆️ No name="notes" on purpose – we include it inside message instead */}
      </div>

      <div style={{ marginTop: "30px", display: "flex", gap: "10px" }}>
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
          Submit Quote
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
                  {/* Multi-sensor patches */}
{selectedSensors.length > 0 && !foamActive && (
  <>
    {selectedSensors.map((sensor, index) => {
      // spacing offset
      const total = selectedSensors.length;
      const offset = (index - (total - 1) / 2) * (patchWidth * 1.2);

      if (shape === "Donut") {
        // evenly position around mid-radius arc
        const angle = (index / total) * Math.PI - Math.PI / 2; 
        const x = centerX + Math.cos(angle) * midRpx;
        const y = centerY + Math.sin(angle) * midRpx;

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
              transform: "translate(-50%, -50%)",
              border: "1px solid #800000",
              borderRadius: "2px",
              zIndex: 3,
            }}
          />
        );
      }

      // Rectangle & Circle → horizontal spacing
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
  </>
)}


                  {/* Limiter patch (solid circle just above termination patch) */}
{limiterEnabled && (
  shape === "Donut" ? (
    // DONUT: limiter at right mid-radius
    <div
      style={{
        position: "absolute",
        width: patchWidth * 0.9,
        height: patchWidth * 0.9,
        borderRadius: "50%",
        backgroundColor: "#b22222",
        border: `1px solid #800000`,
        left: `${donutLimiterLeftPx}px`,
        top: `${centerY}px`,
        transform: "translate(-50%,-50%)",
        zIndex: 3,
      }}
    />
  ) : (
    // Other shapes: directly above termination patch, visually snug
    <div
      style={{
        position: "absolute",
        width: patchWidth * 0.9,
        height: patchWidth * 0.9,
        borderRadius: "50%",
        backgroundColor: "#b22222",
        border: "1px solid #800000",
        bottom: patchHeight + 4 * scale, // ✅ brings it closer to termination patch
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 3,
      }}
    />
  )
)}


{/* Termination patch (visually flush with heater bottom, stable across scale) */}
<div
  style={{
    position: "absolute",
    width: patchWidth,
    height: patchHeight,
    backgroundColor: "#b22222",
    left: "50%",
    bottom: `${(patchWidth - patchHeight) / 2}px`,  // ✅ gentle upward correction
    transform: "translateX(-50%) rotate(90deg)",
    transformOrigin: "center",
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
    {/* Left lead */}
    <div
      style={{
        position: "absolute",
        width: leadThickness,
        height: leadLength,
        backgroundColor: "black",
        bottom: -leadLength + 1 * scale, // keeps contact tight with patch
        left: "50%",
        transform: `translateX(-${leadSpacing / 2 + leadThickness / 2}px)`,
        zIndex: 4,
      }}
    />
    {/* Right lead */}
    <div
      style={{
        position: "absolute",
        width: leadThickness,
        height: leadLength,
        backgroundColor: "black",
        bottom: -leadLength + 1 * scale,
        left: "50%",
        transform: `translateX(${leadSpacing / 2 - leadThickness / 2}px)`,
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

            <div style={{ marginTop: patchHeight + 40, fontSize: "14px", color: "#333",fontWeight: "bold" }}>
              Connection Length: {connectionLengthNum.toFixed(1)} m
            </div>
{/* --- Side View --- */}
{(foam !== "None" || fixingAdhesive === "Yes") && (
  <div style={{ marginTop: "30px" }}>
    <h4 style={{ color: "#E50520", marginBottom: "8px", textAlign: "center" }}>
      Side View
    </h4>

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
      {/* Foam layer (top) */}
      {foam !== "None" && (
        <div
          style={{
            height: foamPx,
            width: "100%",
            backgroundColor: "#d3d3d3",
            boxSizing: "border-box",
          }}
        />
      )}

      {/* Join line between foam & heater */}
      {foam !== "None" && (
        <div
          style={{
            height: 2,
            width: "100%",
            backgroundColor: "#8B0000",
            marginTop: -2,
          }}
        />
      )}

      {/* Heater layer (fixed ~1.5 mm visual) */}
      <div
        style={{
          height: 3,
          width: "100%",
          backgroundColor: "#8B0000",
          boxSizing: "border-box",
        }}
      />

      {/* Adhesive layer (optional; thinner + new color) */}
      {fixingAdhesive === "Yes" && (
        <div
          style={{
            height: 2,                // slightly thinner
            width: "100%",
            backgroundColor: "#b38f5a", // warmer adhesive color
            boxSizing: "border-box",
          }}
        />
      )}
    </div>

    {/* Description under the side view */}
    <p style={{ fontSize: 12, marginTop: 6, color: "#333", textAlign: "center" }}>
      {foam !== "None"
        ? `Foam (${foam}) on top of heater${fixingAdhesive === "Yes" ? ", with adhesive backing." : "."}`
        : fixingAdhesive === "Yes"
        ? "Heater with adhesive backing."
        : "No additional layers applied."}
    </p>
  </div>
)}

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
              <h4 style={{ marginBottom: "10px", color: "#E50520",  fontSize: "18px" }}>Heater Summary</h4>
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
