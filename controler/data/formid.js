const FormJson=[
    {
    formId:1,
    FormName:"ContactUs",
    pageId:2,
    content:[
             {type: "text" ,className:"Name" ,placeholder: "  Name",value:"" }, 
             {type:"text" ,className:"Name",placeholder:"  Email",value:""},
             {type:"long-text" ,className:"message" ,placeholder:"  message" ,value:""},
            ]
    },

    {
     formId:2,
     FormName:"login",
     pageId:3,
     content:[{type: "text" ,className:"input-fieldd" ,placeholder: "  Email",value:"" },
              {type:"text" ,className:"input-fieldd",placeholder:"  Password",value:""},],

    },
    
    {
        formId: 3,
        FormName: "signUp",
        pageId:4,
        content: [
            {
                leftside: [
                    { type: "text", className: "input-field", placeholder: "Full Name", value: "" },
                    { type: "password", className: "input-field", placeholder: "Password", value: "" },
                    { type: "text", className: "input-field", placeholder: "City", value: "" },
                    { type: "text", className: "input-field", placeholder: "Microchip Number", value: "" },
                    { type: "text", className: "input-field", placeholder: "Animal Color", value: "" }
                ]
            },
            {
                rightside: [
                    { type: "text", className: "input-field", placeholder: "Email", value: "" },
                    { type: "password", className: "input-field", placeholder: "Confirm Password", value: "" },
                    { type: "text", className: "input-field", placeholder: "Phone Number", value: "" },
                    { type: "text", className: "input-field", placeholder: "Animal Kind", value: "" }
                ]
            }
        ],
    }
]
module.exports = {FormJson};