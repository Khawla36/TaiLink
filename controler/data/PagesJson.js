
const PagesJson = [
  {
  pageId:1, 
  PageName:"AboutUs",
  title: "TaiLink",
  url: "./aboutus",
  content:[{p:"TaiLink helps locate lost or stolen pets through the use of a microchip implanted in them,Our website has many feature: "},
           {p:"- Allowing those who found the pets to conversate with the owners."},
           {p:"- Enabling them to provide updates via the chip's identification number."},
           {p:"- Users can also post information about lost pets that have not yet been found or animals in need of assistance"},
           {p:"- Suggestions for veterinary services or suitable homes can also be provided."}],
  formId:"",
  },

  {
  pageId:2,
  PageName:"Contact Us",
  url: "./Contactus",
  content:["We are here for you!"],
  formId:1,
  text:[
      {type: "text" ,className:"Name" ,placeholder: "   Name",value:"" },
      {type:"text" ,className:"Name",placeholder:"   Email",value:""},
      {type:"long-text" ,className:"message" ,placeholder:"   Message" ,value:""},

     ],

  Img2:"./gp.png",
  Img1:"./fb.png"
  },

  {
  pageId:3,
  PageName:"LogIn",
  url: "/Login",
  content:[""],
  buttons:[{ type: "button", className: "toggle-btn1",text:"Log in" },
           { type: "button", className: "toggle-btn1",text:"Sign up" }],
  text:[{type: "text" ,className:"input-field1" ,placeholder: "  Email",value:"" },
        {type:"text" ,className:"input-field1",placeholder:"  Password",value:""}
          ],
  formId:2,
  Img1:"./gb.png",
  Img2:"./fb.png"

  },

  {
  pageId:4,
  PageName:"Signup",
  url: "/Signup",
  content:[""],
  formId:3,
  specialElement:"Select photo" ,
  buttons:[{ type: "button", className: "toggle-btn",text:"Log in" },
           { type: "button", className: "toggle-btn",text:"Sign up" }],
  text: [
          {
              leftside: [
                  { type: "text", className: "input-field", placeholder: "   Full Name", value: "" },
                  { type: "password", className: "input-field", placeholder: "   Password", value: "" },
                  { type: "text", className: "input-field", placeholder: "   City", value: "" },
                  { type: "text", className: "input-field", placeholder: "   Microchip Number", value: "" },
                  { type: "text", className: "input-field", placeholder: "   Animal Color", value: "" }
              ]
          },
          {
              rightside: [
                  { type: "text", className: "input-field", placeholder: "   Email", value: "" },
                  { type: "password", className: "input-field", placeholder: "   Confirm Password", value: "" },
                  { type: "text", className: "input-field", placeholder: "   Phone Number", value: "" },
                  { type: "text", className: "input-field", placeholder: "   Animal Kind", value: "" }
              ]
          }
          ],
  Img1:"./gb.png",
  Img2:"./fb.png"
   },

  {
  pageId:5,
  PageName:"Homepage",
  content:[{t1:"Find"},{t1:"your"},{t1:"lost"},{t1:"prt"},{t1: "on click"},
           {t2: "TaiLink makes your"},{t2: "life easier"},
           {t3:"Rescue"},{t3:"Shelters"},{t3:"Find a pet"},{t3:"Help us"}],
  url: "./Homepage",
  formId:4,
  gallery:["./media/paw11.png","./media/hom3.png","./media/images.jpg"]
  },              

  {
  pageId:6,
  PageName:"Service1",
  url: "./service",
  content:["Hello Khawla!","Lost Your Pet? TaiLink Makes Finding Them Easy"],
  formId:5,
  Img:"",

  },

  {
  pageId:7,
  PageName:"service2",
  url: "./map",
  content:["Live Location"],
  api: "map"

  }
  ]

module.exports = {PagesJson};
