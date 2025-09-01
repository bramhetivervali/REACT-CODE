// import { useState, useEffect } from "react";

// export default function FormBuilder() {
//   const [questions, setQuestions] = useState([]);
//   const [showCode, setShowCode] = useState(false);
//   const [formJSON, setFormJSON] = useState({});
//   const [codeText, setCodeText] = useState(""); // editable code panel text

//   // === Actions ===
//   const addQuestion = () => {
//     setQuestions([
//       ...questions,
//       { id: questions.length + 1, question: "", type: "radio", options: [""] },
//     ]);
//   };

//   const updateQuestion = (id, key, value) => {
//     setQuestions(
//       questions.map((q) => (q.id === id ? { ...q, [key]: value } : q))
//     );
//   };

//   // const updateOption = (questionId, optionIdx, newValue) => {
//   //   setQuestions((prev) =>
//   //     prev.map((q) =>
//   //       q.id === questionId
//   //         ? {
//   //             ...q,
//   //             options: q.options.map((opt, i) =>
//   //               i === optionIdx ? newValue : opt
//   //             ),
//   //           }
//   //         : q
//   //     )
//   //   );
//   // };
//   const updateOption = (questionId, optionIdx, newValue) => {
//     setQuestions((prev) =>
//       prev.map((q) => {
//         if (q.id !== questionId) return q;

//         // if no change, return q as-is (avoids re-render)
//         if (q.options[optionIdx] === newValue) return q;

//         // else update only the changed option
//         const updatedOptions = [...q.options];
//         updatedOptions[optionIdx] = newValue;

//         return { ...q, options: updatedOptions };
//       })
//     );
//   };

//   const addOption = (id) => {
//     setQuestions(
//       questions.map((q) =>
//         q.id === id ? { ...q, options: [...q.options, ``] } : q
//       )
//     );
//   };

//   const deleteQuestion = (id) => {
//     setQuestions(questions.filter((q) => q.id !== id));
//   };

//   const deleteOption = (id, index) => {
//     setQuestions(
//       questions.map((q) =>
//         q.id === id
//           ? { ...q, options: q.options.filter((_, i) => i !== index) }
//           : q
//       )
//     );
//   };

//   // === JSON Schema (auto update) ===
//   useEffect(() => {
//     const jsonSchema = questions.reduce((acc, q) => {
//       acc[q.id] = {
//         question: q.question,
//         type: q.type,
//         options: q.options,
//       };
//       return acc;
//     }, {});
//     setFormJSON(jsonSchema);
//   }, [questions]);

//   // === Keep codeText updated whenever form changes ===
//   useEffect(() => {
//     setCodeText(generateFullHTML());
//   }, [formJSON]);

//   // === Parse HTML back into questions when code changes ===
//   const handleCodeChange = (newCode) => {
//     setCodeText(newCode);

//     try {
//       // Create a DOM parser
//       const parser = new DOMParser();
//       const doc = parser.parseFromString(newCode, "text/html");

//       const qNodes = [...doc.querySelectorAll(".question")];
//       const parsedQuestions = qNodes.map((qNode, index) => {
//         const questionText = qNode.querySelector("p")?.textContent || "";
//         const inputs = [...qNode.querySelectorAll("input")];
//         const type = inputs[0]?.type || "radio";
//         const options = inputs.map(
//           (inp) => inp.value || inp.nextSibling?.textContent?.trim() || ""
//         );
//         return {
//           id: index + 1,
//           question: questionText,
//           type,
//           options,
//         };
//       });

//       if (parsedQuestions.length > 0) {
//         setQuestions(parsedQuestions);
//       }
//     } catch (err) {
//       console.error("Invalid HTML, ignoring parse", err);
//     }
//   };

//   // === Save JSON to File ===
//   const downloadJSON = () => {
//     const blob = new Blob([JSON.stringify(formJSON, null, 2)], {
//       type: "application/json",
//     });
//     const url = URL.createObjectURL(blob);

//     const a = document.createElement("a");
//     a.href = url;
//     a.download = "form-schema.json";
//     a.click();

//     URL.revokeObjectURL(url);
//   };

//   // === Shared CSS ===
//   const generateCSS = () => `
// body {
//   font-family: "Google Sans", Roboto, Arial, sans-serif;
//   background: #f1f3f4;
//   margin: 0;
//   padding: 0;
// }

// form {
//   max-width: 700px;
//   margin: 40px auto;
//   background: #fff;
//   padding: 30px 40px;
//   border-radius: 12px;
//   box-shadow: 0 2px 8px rgba(0,0,0,0.1);
// }

// .question {
//   margin-bottom: 30px;
//   padding: 20px;
//   border: 1px solid #e0e0e0;
//   border-radius: 8px;
//   position: relative;
//   background: #fafafa;
// }

// .question p {
//   font-size: 16px;
//   font-weight: 500;
//   color: #202124;
//   margin-bottom: 12px;
// }

// label {
//   display: flex;
//   align-items: center;
//   font-size: 15px;
//   color: #3c4043;
//   margin-bottom: 10px;
//   cursor: pointer;
// }

// label input {
//   margin-right: 12px;
//   accent-color: #5f2eea;
//   transform: scale(1.2);
// }

// input[type="text"] {
//   width: 90%;
//   padding: 10px;
//   margin-bottom: 12px;
//   border: 1px solid #ccc;
//   border-radius: 6px;
//   background: #fff;
//   color: #000;
// }

// button {
//   padding: 8px 16px;
//   background: #5f2eea;
//   color: white;
//   font-weight: 500;
//   font-size: 14px;
//   border: none;
//   border-radius: 6px;
//   cursor: pointer;
//   transition: background 0.2s ease;
//   margin-top: 8px;
//   margin-right: 8px;
// }

// button:hover {
//   background: #4a1ec7;
// }

// .delete-x {
//   background: none;
//   border: none;
//   color: #e53935;
//   font-size: 16px;
//   font-weight: bold;
//   cursor: pointer;
// }

// .delete-x:hover {
//   color: #c62828;
// }

// .option-row {
//   display: flex;
//   align-items: center;
//   margin-bottom: 8px;
// }
// `;
//   function keepCursor(fn) {
//     const el = document.activeElement;
//     let pos = el && el.selectionStart;
//     let id = el && el.dataset && el.dataset.idx;
//     fn(); // re-render
//     if (id != null) {
//       const newEl = document.querySelector(`[data-idx="${id}"]`);
//       if (newEl) {
//         newEl.focus();
//         if (pos != null) newEl.setSelectionRange(pos, pos);
//       }
//     }
//   }
//   // === HTML & JS Generators ===
//   const generateHTMLBody = () => `
// <form id="generated-form">
//   ${questions
//     .map(
//       (q) => `
//       <div class="question">
//         <p>${q.question}</p>
//         ${q.options
//           .map(
//             (opt) =>
//               `<label><input type="${q.type}" name="${q.id}" value="${opt}"> ${opt}</label>`
//           )
//           .join("\n")}
        
//       </div>`
//     )
//     .join("\n")}
//   <button type="submit">Submit</button>
// </form>
// `;

//   const generateJS = () => `
// document.getElementById("generated-form").addEventListener("submit", function(e) {
//   e.preventDefault();
//   const formData = new FormData(this);
//   let output = "";
//   for (let [key, value] of formData.entries()) {
//     output += key + ": " + value + "\\n";
//   }
//   alert("Form submitted with data:\\n" + output);
// });
// `;

//   const generateFullHTML = () => `<!DOCTYPE html>
// <html lang="en">
// <head>
//   <meta charset="UTF-8" />
//   <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
//   <title>Generated Form</title>
//   <style>
// ${generateCSS()}
//   </style>
// </head>
// <body>
//   ${generateHTMLBody()}
//   <script>
// ${generateJS()}
//   </script>
// </body>
// </html>`;

//   return (
//     <div
//       style={{
//         position: "fixed",
//         top: 0,
//         left: 0,
//         width: "100vw",
//         height: "100vh",
//         display: "flex",
//         flexDirection: "column",
//         fontFamily: "Google Sans, Arial, sans-serif",
//         background: "#f1f3f4",
//         color: "#000",
//       }}
//     >
//       {/* Top Nav */}
//       <div
//         style={{
//           flexShrink: 0,
//           display: "flex",
//           padding: "10px",
//           borderBottom: "2px solid #ddd",
//           background: "#fff",
//           boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
//         }}
//       >
//         <button onClick={() => setShowCode(false)}>Form</button>
//         <button onClick={() => setShowCode(true)}>Code</button>
//         <button
//           onClick={downloadJSON}
//           style={{ marginLeft: "10px", backgroundColor: "#34a853" }}
//         >
//           Download JSON
//         </button>
//       </div>

//       {/* Main Panels */}
//       <div
//         style={{
//           flex: 1,
//           display: "flex",
//           background: "#f1f3f4",
//           minHeight: 0,
//         }}
//       >
//         {/* LEFT: Form Builder (scrollable) */}
//         <div
//           style={{ flex: showCode ? 1 : 1, padding: "40px", overflowY: "auto" }}
//         >
//           <style>{generateCSS()}</style>
//           <form>
//             <button type="button" onClick={addQuestion}>
//               ➕ Add Question
//             </button>
//             <p></p>
//             {questions.map((q) => (
//               <div className="question" key={q.id}>
//                 {/* Delete Question X */}
//                 <button
//                   type="button"
//                   className="delete-x"
//                   style={{
//                     position: "absolute",
//                     top: "9px",
//                     right: "8px",
//                     padding: "2px",
//                   }}
//                   onClick={() => deleteQuestion(q.id)}
//                 >
//                   ❌
//                 </button>

//                 <input
//                   type="text"
//                   placeholder="Enter question"
//                   value={q.question}
//                   onChange={(e) =>
//                     updateQuestion(q.id, "question", e.target.value)
//                   }
//                 />

//                 <div>
//                   <label>
//                     <input
//                       type="radio"
//                       checked={q.type === "radio"}
//                       onChange={() => updateQuestion(q.id, "type", "radio")}
//                     />{" "}
//                     Radio
//                   </label>
//                   <label>
//                     <input
//                       type="radio"
//                       checked={q.type === "checkbox"}
//                       onChange={() => updateQuestion(q.id, "type", "checkbox")}
//                     />{" "}
//                     Checkbox
//                   </label>
//                 </div>

//                 {q.options.map((opt, idx) => (
//                   <div key={idx} className="option-row">
//                     <input
//                       type={q.type}
//                       disabled
//                       style={{ marginRight: "8px" }}
//                     />

//                     <input
//                       type="text"
//                       value={q.options[idx] || ""}
//                       placeholder="Edit option"
//                       key={q.id + "-" + idx} // stable key prevents full re-render
//                       onChange={(e) => {
//                         const el = e.target;
//                         const cursorPos = el.selectionStart; // save cursor
//                         const newValue = e.target.value;

//                         // update state
//                         updateOption(q.id, idx, newValue);

//                         // restore cursor immediately
//                         setTimeout(() => {
//                           el.selectionStart = cursorPos;
//                           el.selectionEnd = cursorPos;
//                         }, 0);
//                       }}
//                     />

//                     <button
//                       type="button"
//                       className="delete-x"
//                       onClick={() => deleteOption(q.id, idx)}
//                     >
//                       ❌
//                     </button>
//                   </div>
//                 ))}

//                 <button type="button" onClick={() => addOption(q.id)}>
//                   ➕ Add Option
//                 </button>
//               </div>
//             ))}
//             <button type="submit">Submit</button>
//           </form>
//         </div>

//         {/* RIGHT: Code Panel (scrollable, editable) */}
//         {showCode && (
//           <div
//             style={{
//               flex: 1,
//               background: "#1e1e1e",
//               padding: "30px",
//               fontFamily: "monospace",
//               color: "#d4d4d4",
//               overflowY: "auto",
//               minHeight: 0,
//             }}
//           >
//             <h3 style={{ color: "#5f2eea" }}>📄 Full HTML File Code</h3>
//             <textarea
//               value={codeText}
//               onChange={(e) => handleCodeChange(e.target.value)}
//               style={{
//                 width: "100%",
//                 height: "90%",
//                 background: "transparent",
//                 color: "#d4d4d4",
//                 border: "none",
//                 resize: "none",
//                 outline: "none",
//                 fontSize: "14px",
//                 lineHeight: "1.5",
//               }}
//             />
//           </div>
//         )}
//       </div>

import { useState, useEffect } from "react";

export default function FormBuilder() {
  const [questions, setQuestions] = useState([]);
  const [showCode, setShowCode] = useState(false);
  const [formJSON, setFormJSON] = useState({});
  const [codeText, setCodeText] = useState("");
  const [language, setLanguage] = useState("javascript"); // javascript, python, vbscript

  // === Actions ===
  const addQuestion = () => {
    setQuestions([
      ...questions,
      { id: questions.length + 1, question: "", type: "radio", options: [""] },
    ]);
  };

  const updateQuestion = (id, key, value) => {
    setQuestions(
      questions.map((q) => (q.id === id ? { ...q, [key]: value } : q))
    );
  };

  const updateOption = (questionId, optionIdx, newValue) => {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id !== questionId) return q;
        if (q.options[optionIdx] === newValue) return q;
        const updatedOptions = [...q.options];
        updatedOptions[optionIdx] = newValue;
        return { ...q, options: updatedOptions };
      })
    );
  };

  const addOption = (id) => {
    setQuestions(
      questions.map((q) =>
        q.id === id ? { ...q, options: [...q.options, ""] } : q
      )
    );
  };

  const deleteQuestion = (id) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  const deleteOption = (id, index) => {
    setQuestions(
      questions.map((q) =>
        q.id === id
          ? { ...q, options: q.options.filter((_, i) => i !== index) }
          : q
      )
    );
  };

  // === JSON Schema ===
  useEffect(() => {
    const jsonSchema = questions.reduce((acc, q) => {
      acc[q.id] = { question: q.question, type: q.type, options: q.options };
      return acc;
    }, {});
    setFormJSON(jsonSchema);
    setCodeText(generateFullCode(language));
  }, [questions, language]);

  // === Parse HTML back into form ===
  const handleCodeChange = (newCode) => {
    setCodeText(newCode);
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(newCode, "text/html");
      const qNodes = [...doc.querySelectorAll(".question")];
      const parsedQuestions = qNodes.map((qNode, index) => {
        const questionText = qNode.querySelector("p")?.textContent || "";
        const inputs = [
          ...qNode.querySelectorAll(
            "input[type='radio'],input[type='checkbox']"
          ),
        ];
        const type = inputs[0]?.type || "radio";
        const options = inputs.map(
          (inp) => inp.value || inp.nextSibling?.textContent?.trim() || ""
        );
        return { id: index + 1, question: questionText, type, options };
      });
      if (parsedQuestions.length > 0) setQuestions(parsedQuestions);
    } catch {}
  };

  // === Download JSON ===
  const downloadJSON = () => {
    const blob = new Blob([JSON.stringify(formJSON, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "form-schema.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  // === CSS ===
  const generateCSS = () => `
body {
  font-family: "Google Sans", Roboto, Arial, sans-serif;
  background: #f1f3f4;
  margin: 0;
  padding: 0;
}
form {
  max-width: 700px;
  margin: 40px auto;
  background: #fff;
  padding: 30px 40px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
.question {
  margin-bottom: 30px;
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  position: relative;
  background: #fafafa;
}
.question p {
  font-size: 16px;
  font-weight: 500;
  color: #202124;
  margin-bottom: 12px;
}
label {
  display: flex;
  align-items: center;
  font-size: 15px;
  color: #3c4043;
  margin-bottom: 10px;
  cursor: pointer;
}
label input {
  margin-right: 12px;
  accent-color: #5f2eea;
  transform: scale(1.2);
}
input[type="text"] {
  width: 90%;
  padding: 10px;
  margin-bottom: 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
  background: #fff;
  color: #000;
}
button {
  padding: 8px 16px;
  background: #5f2eea;
  color: white;
  font-weight: 500;
  font-size: 14px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s ease;
  margin-top: 8px;
  margin-right: 8px;
}
button:hover { background: #4a1ec7; }
.delete-x {
  background: none;
  border: none;
  color: #e53935;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
}
.delete-x:hover { color: #c62828; }
.option-row { display: flex; align-items: center; margin-bottom: 8px; }
`;

  // === HTML + JS generators ===
  const generateHTMLBody = () => `
<form id="generated-form">
${questions
  .map(
    (q) => `<div class="question">
<p>${q.question}</p>
${q.options
  .map(
    (opt) =>
      `<label><input type="${q.type}" name="${q.id}" value="${opt}"> ${opt}</label>`
  )
  .join("\n")}
</div>`
  )
  .join("\n")}
<button type="submit">Submit</button>
</form>
`;

  const generateJS = () => `
document.getElementById("generated-form").addEventListener("submit", function(e) {
  e.preventDefault();
  const formData = new FormData(this);
  let output = "";
  for (let [key, value] of formData.entries()) { output += key + ": " + value + "\\n"; }
  alert("Form submitted with data:\\n" + output);
});
`;

  // === Multi-language code ===
  const generateFullCode = (lang) => {
    if (lang === "javascript") {
      return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>Generated Form</title>
<style>${generateCSS()}</style>
</head>
<body>
${generateHTMLBody()}
<script>${generateJS()}</script>
</body>
</html>`;
    } else if (lang === "python") {
      return `
# Flask app for generated form
from flask import Flask, render_template_string, request
app = Flask(__name__)

@app.route("/", methods=["GET","POST"])
def index():
    if request.method=="POST":
        form_data = {k:v for k,v in request.form.items()}
        return "<pre>" + str(form_data) + "</pre>"
    html_form = """${generateHTMLBody()}<style>${generateCSS()}</style><script>${generateJS()}</script>"""
    return render_template_string(html_form)

if __name__=="__main__":
    app.run(debug=True)
`;
    } else if (lang === "vbscript") {
      return `
' VBScript pseudo-form
<html>
<head>
<style>${generateCSS()}</style>
</head>
<body>
${generateHTMLBody()
  .replace(/type="radio"/g, 'type="radio"')
  .replace(/type="checkbox"/g, 'type="checkbox"')}
<button type="button" onclick="SubmitForm()">Submit</button>
<script language="VBScript">
Sub SubmitForm()
  MsgBox "Form submitted! (VBScript pseudo-behavior)"
End Sub
</script>
</body>
</html>
`;
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        fontFamily: "Google Sans, Arial, sans-serif",
        background: "#f1f3f4",
        color: "#000",
      }}
    >
      {/* Top Nav */}
      <div
        style={{
          flexShrink: 0,
          display: "flex",
          padding: "10px",
          borderBottom: "2px solid #ddd",
          background: "#fff",
          boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
        }}
      >
        <button onClick={() => setShowCode(false)}>Form</button>
        <button onClick={() => setShowCode(true)}>Code</button>
        <button
          onClick={downloadJSON}
          style={{ marginLeft: "10px", backgroundColor: "#34a853" }}
        >
          Download JSON
        </button>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          style={{ marginLeft: "20px", padding: "4px" }}
        >
          <option value="javascript">JavaScript</option>
          <option value="python">Python (Flask)</option>
          <option value="vbscript">VBScript</option>
        </select>
      </div>

      {/* Main Panels */}
      <div
        style={{
          flex: 1,
          display: "flex",
          background: "#f1f3f4",
          minHeight: 0,
        }}
      >
        {/* LEFT: Form Builder */}
        <div
          style={{ flex: showCode ? 1 : 1, padding: "40px", overflowY: "auto" }}
        >
          <style>{generateCSS()}</style>
          <form>
            <button type="button" onClick={addQuestion}>
              ➕ Add Question
            </button>
            {questions.map((q) => (
              <div className="question" key={q.id}>
                <button
                  type="button"
                  className="delete-x"
                  style={{
                    position: "absolute",
                    top: "9px",
                    right: "8px",
                    padding: "2px",
                  }}
                  onClick={() => deleteQuestion(q.id)}
                >
                  ❌
                </button>
                <input
                  type="text"
                  placeholder="Enter question"
                  value={q.question}
                  onChange={(e) =>
                    updateQuestion(q.id, "question", e.target.value)
                  }
                />
                <div>
                  <label>
                    <input
                      type="radio"
                      checked={q.type === "radio"}
                      onChange={() => updateQuestion(q.id, "type", "radio")}
                    />{" "}
                    Radio
                  </label>
                  <label>
                    <input
                      type="radio"
                      checked={q.type === "checkbox"}
                      onChange={() => updateQuestion(q.id, "type", "checkbox")}
                    />{" "}
                    Checkbox
                  </label>
                </div>
                {q.options.map((opt, idx) => (
                  <div key={idx} className="option-row">
                    <input
                      type={q.type}
                      disabled
                      style={{ marginRight: "8px" }}
                    />
                    <input
                      type="text"
                      value={q.options[idx] || ""}
                      placeholder="Edit option"
                      onChange={(e) => updateOption(q.id, idx, e.target.value)}
                    />
                    <button
                      type="button"
                      className="delete-x"
                      onClick={() => deleteOption(q.id, idx)}
                    >
                      ❌
                    </button>
                  </div>
                ))}
                <button type="button" onClick={() => addOption(q.id)}>
                  ➕ Add Option
                </button>
              </div>
            ))}
            <button TYPE="submit">submit</button>
          </form>
        </div>

        {/* RIGHT: Code Panel */}
        {showCode && (
          <div
            style={{
              flex: 1,
              background: "#1e1e1e",
              padding: "30px",
              fontFamily: "monospace",
              color: "#d4d4d4",
              overflowY: "auto",
              minHeight: 0,
            }}
          >
            <h3 style={{ color: "#5f2eea" }}>
              📄 Full {language.toUpperCase()} Code
            </h3>
            <textarea
              value={codeText}
              onChange={(e) => handleCodeChange(e.target.value)}
              style={{
                width: "100%",
                height: "90%",
                background: "transparent",
                color: "#d4d4d4",
                border: "none",
                resize: "none",
                outline: "none",
                fontSize: "14px",
                lineHeight: "1.5",
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

//     </div>
//   );
// }
