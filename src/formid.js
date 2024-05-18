const FormJson=[
    {
    formId:1,
    formName:"Contact Us",
    content:[
             {type: "text" ,className:"Name" ,placeholder: "  Name",value:"" },
             
             {type:"text" ,className:"Name",placeholder:"  Email",value:""},
             
             {type:"long-text" ,className:"message" ,placeholder:"  message" ,value:""},

            ]
    },

    {
     formId:2,
     pageName:"login",
     content:[{type: "text" ,className:"input-fieldd" ,placeholder: "  Email",value:"" },
              {type:"text" ,className:"input-fieldd",placeholder:"  Password",value:""},],

     buttons:["back","Login1","Sign up","facebook","google","Login2","change/forget password?"]

    },
    
    {
        formId: 3,
        pageName: "Sign Up",
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
,

    {
     formId:4,
     pageName:"Home page",
     buttons:["EN","Log in","Sign up","Buy a microchip","Help animals","Post lost animals","Find my pet","Shop Now","Find A Pet","Help Us","Pet","Help","Rescue","Shelters","Contact Us","About Us","Facebook","Instagram","TiKTok"]

    },

    

    {
     formId:5,
     pageName:"service1",
     content:["Microchip number"],
     buttons:["back","Send Pet's Location"]
     
    }
]
export default FormJson;