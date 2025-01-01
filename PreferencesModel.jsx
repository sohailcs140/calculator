import React, { useState, useEffect } from "react";
import { BackendPaths, Python1PathMessage, Python2PathMessage } from "../utils/constant";
import FileOpenIcon from '@mui/icons-material/FileOpen';
import { ThemeMaped } from "../utils/constant";
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';


const PreferencesModel = ({
  onNewFile,
  onOpenFile,
  onPreferencesChange,
  preferences,
  onThemeChange,
  setPreferences,
  btnSaveRef
}) => {
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  

  const handleOpenFile = async() => {
    try {
      const response = await window.myAPI?.openFile();
        onOpenFile(response)
    } catch (error) {
      console.error("Error opening file:", error);
      alert("An unexpected error occurred.");
    }
  };


  const handlePreferencesChange = (field, value) => {
    setPreferences((prev) => ({ ...prev, [field]: value }));
  };

  const handlePreferencesSave = () => {
    onPreferencesChange(preferences); // Pass preferences to the parent component
    setPreferencesOpen(false);
  };
  const handleThemeChange = (newTheme)=>{
    onThemeChange(ThemeMaped[newTheme])
  }

  const handleSubmit = async(event)=>{
    event.preventDefault();
    
    const pythonPath1 =  event.target.pythonPath1.value;
    const pythonPath2 = event.target.pythonPath2.value;
    try{

      const respo = await fetch(BackendPaths.configuration, {
        method: "POST", 
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          path_first:pythonPath1,
          path_second:pythonPath2
        }),
      });
      
       await respo.json(); 
    }catch(error){
      console.log(error);
      
    }
    
    handlePreferencesSave()
  }


  const handleSelectPythonPaths = async (number)=>{

    const pythonPath = await window.myAPI.pythonDialog(number==1?Python1PathMessage:Python2PathMessage);

    if(number == 1){ // set python first path
      handlePreferencesChange("pythonPath1", pythonPath)
    }
    if(number == 2){ // set python second path
      handlePreferencesChange("pythonPath2", pythonPath)
    }

  }

  useEffect(()=>{

  window.myAPI?.on("event-open-new-file", onNewFile)
  window.myAPI?.on("event-open-file", handleOpenFile)
  window.myAPI?.on("event-save-file", async()=> {    
    btnSaveRef?.current?.click()
  })
  window.myAPI?.on("event-settings-preferences", ()=> setPreferencesOpen(true))

  return () => {
    window.myAPI?.on("event-open-new-file", null);
    window.myAPI?.on("event-open-file", null);
    window.myAPI?.on("event-save-file", null);
    window.myAPI?.on("event-settings-preferences", null);
  };

  },[])


  return (
    <>
      {preferencesOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-gray-800 text-white w-[30rem] p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Preferences</h2>
            <form onSubmit={handleSubmit}>
            {/* Python Paths */}
            <div className="mb-4">
              <label className="block text-gray-300 mb-1">Python Path 1:</label>
             <div className="bg-gray-700 p-2 rounded flex items-center">
              <input
                  type="text"
                  className="w-[94%] outline-none bg-transparent text-white h-full"
                  name="pythonPath1"
                  defaultValue={preferences.pythonPath1}
                  readOnly
                />
                <button type="button" className="cursor-pointer" onClick={()=>handleSelectPythonPaths(1)}>
                  <FileOpenIcon/>
                </button>
             </div>
            </div>
            <div className="mb-4">
              <label className="block text-gray-300 mb-1">Python Path 2:</label>
              <div className="bg-gray-700 p-2 rounded flex items-center">
              <input
                  type="text"
                  className="w-[94%] outline-none bg-transparent text-white h-full"
                  name="pythonPath2"
                  value={preferences.pythonPath2}
                  onChange={(e) =>
                    handlePreferencesChange("pythonPath2", e.target.value)
                  }
                  readOnly
                />
                <button type="button" className="cursor-pointer" onClick={()=>handleSelectPythonPaths(2)}>
                  <FileOpenIcon/>
                </button>
             </div>
            </div>

            <div className="mb-4">
              <label className="block text-gray-300 mb-1">Theme:</label>
              <select
                className="w-full p-2 border rounded bg-gray-700 text-white"
                  name="theme"
                  onChange={(event)=> handleThemeChange(event.target.value)}
              >
                <option value="oneDark">One Dark</option>
                <option value="dracula">Dracula</option>
                <option value="eclipse">Eclipse</option>
              </select>
            </div>

              <div className="mb-4">
                <label className="block text-gray-300 mb-1">Font Size:</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded bg-gray-700 text-white"
                  value={preferences.fontSize?preferences.fontSize:""}
                  onChange={(e) =>
                    handlePreferencesChange("fontSize", Number(e.target.value))
                  }
                />
              </div>

              <div className="flex justify-end">
                <button
                  className="bg-gray-600 text-white px-4 py-2 rounded mr-2 hover:bg-gray-500"
                  onClick={() => setPreferencesOpen(false)}
                  type="button"
                >
                  <CloseIcon/>
                </button>
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-400"
                  type="submit"
                >
                  <SaveIcon/>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default PreferencesModel;
