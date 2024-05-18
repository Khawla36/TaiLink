
    const PagesJson = [
    {
    pageId:1,
    PageName:"About Us",
    title: "TaiLink",
    url: "./aboutus",
    content:[{p:"TaiLink helps locate lost or stolen pets through the use of a microchip implanted in them,Our website has many feature: "},
             {p:"- allowing thosewho found the pets to conversate with the owners."},
             {p:"- Enabling them to provide updates via the chip's identification number."},
             {p:"- Users can also post information about lost pets that have not yet been found or animals in need of assistance"},
             {p:"- Suggestions for veterinary services or suitable homes can also be provided."}],
    formId:"",
    },


    {
    pageId:2,
    PageName:"Contact US",
    url: "./Contactus",
    content:["We are here for you!"],
    formId:1,
    Img:"./gp.png",
    Img1:"./fb.png"
    },

    {
    pageId:3,
    PageName:"LogIn",
    url: "/Login",
    content:["Email/User Name","Password","Continue with:"],
    formId:2,

    },

    {
    pageId:4,
    PageName:"Sign Up",
    url: "/Signup",
    content:["Continue with:","First Name","Last Name","Password","Confirm Password","City","Phone Number","Email","Microchip Number","Animal Kind","Animal Color"],
    formId:3,
    specialElement:"Select photo" ,
    buttons:[{ type: "button", className: "toggle-btn",text:"Log in" },
             { type: "button", className: "toggle-btn",text:"Sign up" }],
    Img1:"./gb.png",
    Img2:"./fb.png"
     },

    {
    pageId:5,
    PageName:"HomePage",
    content:[{t1:"Find"},{t1:"your"},{t1:"lost"},{t1:"prt"},{t1: "on click"},
             {t2: "TaiLink makes your"},{t2: "life easier"},
             {t3:"Rescue"},{t3:"Shelters"},{t3:"Find a pet"},{t3:"Help us"}],
    url: "./Homepage",
    formId:4,
    galery:["../HomePage1.png","../HomePage2.png","../HomePage3.png","../HomePage4.png"]

    },              

    {
    pageId:6,
    PageName:"service1",
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

export default PagesJson;