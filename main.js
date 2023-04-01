const mongoose = require('mongoose');
main().catch(err => console.log(err));
async function main() 
{
  await mongoose.connect("mongodb://0.0.0.0:27017/Form_Friend",{useNewUrlParser:true});
}
const batchschema = new mongoose.Schema(
  {
        batch: String,
        details:[
          {
            Enrollment: String,
            Name: String,
            Email: String
          }
        ]
      }
);

const Batches=mongoose.model("Batches",batchschema);

const login=new Batches(
  {
        batch:"2021",
        details:[{
          "Enrollment": "210170116001",
          "Name": "CHAVDA MITESH VAJABHAI",
          "Email": "miteshchavda57@gmail.com"
        },{
          "Enrollment": "210170116002",
          "Name": "Solanki Aheen Deepak",
          "Email": "aheensolanki2003@gmail.com"
        },{
          "Enrollment": "210170116003",
          "Name": "LAD SHIVAMKUMAR VINODBHAI",
          "Email": "shivamvlad3@gmail.com"
        },{
          "Enrollment": "210170116004",
          "Name": "Kabariya Het Jitendrabhai",
          "Email": "hetukabariya4209@gmail.com"
        },{
          "Enrollment": "210170116005",
          "Name": "ASODIYA DHRUV ARVINDBHAI",
          "Email": "asodiyadhruv592@gmail.com"
        },{
          "Enrollment": "210170116006",
          "Name": "CHAUDHARI JAIMINKUMAR SHAILESHBHAI",
          "Email": "jaiminkumar111@gmail.com"
        },{
          "Enrollment": "210170116007",
          "Name": "TEJANI HAREKRUSHN GHANSHYAMBHAI",
          "Email": "harekrushntejani64@gmail.com"
        },{
          "Enrollment": "210170116008",
          "Name": "CHAUDHARI DASHRATHBHAI VELAJI",
          "Email": "chaudharydashrath01@gmail.com"
        },{
          "Enrollment": "210170116009",
          "Name": "Maryan Abdirashid Ahmed",
          "Email": "mymaryan2020@gmail.com"
        },{
          "Enrollment": "210170116010",
          "Name": "Vasoya Prins Nareshbhai",
          "Email": "vasoyaprinsu111@gmail.com"
        },{
          "Enrollment": "210170116011",
          "Name": "BORKHATARIYA KEVIN JAGMALBHAI",
          "Email": "borkhatariyakevin@gmail.com"
        },{
          "Enrollment": "210170116012",
          "Name": "PATEL KAMLESH SANWALARAM",
          "Email": "kamleshpatel12328@gmail.com"
        },{
          "Enrollment": "210170116013",
          "Name": "GAMETI ARTHKUMAR SIDDHARAJBHAI",
          "Email": "arthgameti8330@gmail.com"
        },{
          "Enrollment": "210170116014",
          "Name": "Chauhan Ayush Vijaykumar",
          "Email": "ayush2004chauhan2526@gmail.com"
        },{
          "Enrollment": "210170116015",
          "Name": "KHUNTI DILIP JIVABHAI",
          "Email": "dilipkhunti47@gmail.com"
        },{
          "Enrollment": "210170116016",
          "Name": "PANDYA SHUBHAM KAMLESH",
          "Email": "shubhampandya7642.2@gmail.com"
        },{
          "Enrollment": "210170116017",
          "Name": "RAJPUT DHAVALSINH JOGENDRASINH",
          "Email": "rajputdhavaljs@gmail.com"
        },{
          "Enrollment": "210170116018",
          "Name": "DOSHI DEVAM MALAYKUMAR",
          "Email": "devamdoshi212@gmail.com"
        },{
          "Enrollment": "210170116019",
          "Name": "PATEL JAY VINODBHAI",
          "Email": "pateljay40301@gmail.com"
        },{
          "Enrollment": "210170116020",
          "Name": "VYAS DEV GUNVANTRAY",
          "Email": "vyasdev2302@gmail.com"
        },{
          "Enrollment": "210170116021",
          "Name": "ZALA HARICHANDRA DASHARATHSINH",
          "Email": "zalaharichandra11@gmail.com"
        },{
          "Enrollment": "210170116022",
          "Name": "Nishtha Malkan",
          "Email": "nishthamalkan20@gmail.com"
        },{
          "Enrollment": "210170116023",
          "Name": "DAVE TANISHA ASHISHBHAI",
          "Email": "tanishadave207@gmail.com"
        },{
          "Enrollment": "210170116024",
          "Name": "SANGADA KISHANKUMAR ISHWARBHAI",
          "Email": "isvarbhaisangada@gmail.com"
        },{
          "Enrollment": "210170116025",
          "Name": "PATEL MANDIP DINESHBHAI",
          "Email": "mandeep162003@gmail.com"
        },{
          "Enrollment": "210170116026",
          "Name": "PATEL VRAJ DILIPKUMAR",
          "Email": "patelvrajdilipbhai17@gmail.com"
        },{
          "Enrollment": "210170116027",
          "Name": "PATEL MAYANKBHAI SHUKKARBHAI",
          "Email": "mayankpatel0035@gmail.com"
        },{
          "Enrollment": "210170116028",
          "Name": "DIWAN MAITRI SUNILBHAI",
          "Email": "maitridiwan19@gmail.com"
        },{
          "Enrollment": "210170116029",
          "Name": "BHIMANI HEMANSI RAJESHBHAI",
          "Email": "hemansibhimani@gmail.com"
        },{
          "Enrollment": "210170116030",
          "Name": "JIVANI ABHI NAGJIBHAI",
          "Email": "abhijivani3001@gmail.com"
        },{
          "Enrollment": "210170116031",
          "Name": "SANGHANI ISHA RAJESHBHAI",
          "Email": "ishasanghani06@gmail.com"
        },{
          "Enrollment": "210170116032",
          "Name": "MANDAVIYA RITESHBHAI JAYESHBHAI",
          "Email": "mandaviyaritesh77@gmail.com"
        },{
          "Enrollment": "210170116033",
          "Name": "Patel Khushi Mukeshbhai",
          "Email": "khushipatel200431@gmail.com"
        },{
          "Enrollment": "210170116034",
          "Name": "PARMAR DHRUMIT GHANSHYAMBHAI",
          "Email": "dgparmar1406@gmail.com"
        },{
          "Enrollment": "210170116035",
          "Name": "PATEL DHRUVI RAJESHBHAI",
          "Email": "dhruviipatell3007@gmail.com"
        },{
          "Enrollment": "210170116036",
          "Name": "GOHEL UDAY ANIRUDDHBHAI",
          "Email": "goheluday6445@gmail.com"
        },{
          "Enrollment": "210170116037",
          "Name": "BAROT MALHAR HETALKUMAR",
          "Email": "malhargamezone@gmail.com"
        },{
          "Enrollment": "210170116038",
          "Name": "BODAR SNEH SHAILESHBHAI",
          "Email": "snehbodar369@gmail.com"
        },{
          "Enrollment": "210170116039",
          "Name": "DEVANI BHAVYKUMAR PRAVINBHAI",
          "Email": "bhavypdevani31@gmail.com"
        },{
          "Enrollment": "210170116040",
          "Name": "GANDHI HIMANSHI JIGNESHKUMAR",
          "Email": "hgandhi1810@gmail.com"
        },{
          "Enrollment": "210170116041",
          "Name": "SHAH BHAVYA BHARATKUMAR",
          "Email": "bhavyabshah04@gmail.com"
        },{
          "Enrollment": "210170116042",
          "Name": "RAVAL URVASHIBEN JAGDISHBHAI",
          "Email": "urvashiraval1703@gmail.com"
        },{
          "Enrollment": "210170116043",
          "Name": "Patel Nishantkumar Sureshbhai",
          "Email": "np179756@gmail.com"
        },{
          "Enrollment": "210170116044",
          "Name": "PATEL MIHIR SURESHBHAI",
          "Email": "mihirpatel1426@gmail.com"
        },{
          "Enrollment": "210170116045",
          "Name": "PATEL ANCHAL RAJESHKUMAR",
          "Email": "aanchalpatel4404@gmail.com"
        },{
          "Enrollment": "210170116046",
          "Name": "PATIL ABHISHEK RAJENDRABHAI",
          "Email": "abhishekpatil.ap41@gmail.com"
        },{
          "Enrollment": "210170116047",
          "Name": "KORIYA JAYDIP HASMUKH",
          "Email": "jaydipkoriya04@gmail.com"
        },{
          "Enrollment": "210170116048",
          "Name": "Thumar Jahanviben Mitalkishor",
          "Email": "thumarjahanvi@gmail.com"
        },{
          "Enrollment": "210170116049",
          "Name": "PANSURIYA SANKET KIRITBHAI",
          "Email": "sanketpansuria05@gmail.com"
        },{
          "Enrollment": "210170116050",
          "Name": "BHAT OCEAN RAMESH KUMA",
          "Email": "oceanbhat1001@gmail.com"
        },{
          "Enrollment": "210170116051",
          "Name": "Valvai Chiragkumar Ravindrabhai",
          "Email": "chiragvalvai1608@gmail.com"
        },{
          "Enrollment": "210170116052",
          "Name": "MAYUR BARAD",
          "Email": "mayurbarad2003@gmail.com"
        },{
          "Enrollment": "210170116053",
          "Name": "Brahmaniya Fenil Girishbhhai",
          "Email": "fenilbramhaniyasp00@gmail.com"
        },{
          "Enrollment": "210170116054",
          "Name": "JOSHI ARYAN VIJAYBHAI",
          "Email": "aryanjoshi7997@gmail.com"
        },{
          "Enrollment": "210170116055",
          "Name": "MANISHA PATEL",
          "Email": "2manisha03@gmail.com"
        },{
          "Enrollment": "210170116056",
          "Name": "RATHOD KULDEEP MANUBHAI",
          "Email": "rathodkuldeep9879@gmail.com"
        },{
          "Enrollment": "210170116057",
          "Name": "SHAH HET ASHISHKUMAR",
          "Email": "het.shah303@gmail.com"
        },{
          "Enrollment": "210170116058",
          "Name": "BHATT NANDISH HIREN",
          "Email": "nandish.bhatt2004@gmail.com"
        },{
          "Enrollment": "210170116059",
          "Name": "Chodavdiya Mruganshi Chetanbhai",
          "Email": "mruganshic6@gmail.com"
        },{
          "Enrollment": "210170116060",
          "Name": "NIRMAL HARSH JANAKBHAI",
          "Email": "hnirmal913@gmail.com"
        },{
          "Enrollment": "210170116061",
          "Name": "NAYKA TARAKKUMAR MANHARBHAI",
          "Email": "tarak1141021@gmail.com"
        },{
          "Enrollment": "210170116062",
          "Name": "Bhagora Dipika Bachubhai",
          "Email": "dpkabhagora008@gmail.com"
        },{
          "Enrollment": "210170116063",
          "Name": "RATHOD DHAIRYADEEPSINH HARDEVSINH",
          "Email": "dhairyadeepsinhrathod@gmail.com"
        },{
          "Enrollment": "210170116064",
          "Name": "PARMAR KRUTI DILIPKUMAR",
          "Email": "krutidp2411@gmail.com"
        },{
          "Enrollment": "210170116065",
          "Name": "MODI PRATIK ASHISHBHAI",
          "Email": "ashishmodi07@gmail.com"
        },{
          "Enrollment": "210170116066",
          "Name": "SHAH DHRUV SANDIPKUMAR",
          "Email": "sandipshah4563@gmail.com"
        },{
          "Enrollment": "210170116067",
          "Name": "MACHHI MEETKUMAR DIPAKBHAI",
          "Email": "meetmachhi2110@gmail.com"
        },{
          "Enrollment": "210170116068",
          "Name": "PATEL VISHALBHAI",
          "Email": "vine1116340@gmail.com"
        },{
          "Enrollment": "210170116069",
          "Name": "Ankoliya Krishnaben Pragjibhai",
          "Email": "krishnaankoliya199@gmail.com"
        },{
          "Enrollment": "210170116070",
          "Name": "TOMAR ABHISHEKSINH RAKESHSINH",
          "Email": "abhishekrtomar123@gmail.com"
        },{
          "Enrollment": "210170116071",
          "Name": "UDAY SINGH MANHAS",
          "Email": "udaymanhas49@gmail.com"
        },{
          "Enrollment": "210170116072",
          "Name": "JETHWA YASH MAHESHBHAI",
          "Email": "yashjethwa1357@gmail.com"
        },{
          "Enrollment": "210170116073",
          "Name": "GADHAVI SANJAY KAMLESHDAN",
          "Email": "shivamgadhavi109@gmail.com"
        }]
  }
) 
login.save();
// var det = [
//         {
//             enrollment:"210170116014",
//         },
//         {
//           enrollment:"210170116007",
//         }
// ]
// var n=det.length;



// Batches.find({batch:{$eq:"2022"}})
// .then(function (data) {
//   var m=data[0].details.length;
 
//   for(var i=0;i<n;i++)
//   {
//     for(var j=0;j<m;j++)
//     {
//       if(data[0].details[j].Enrollment===det[i].enrollment)
//       {
//         console.log(JSON.stringify(data[0].details[j].Enrollment));
//         console.log(JSON.stringify(data[0].details[j].Name));
//         console.log(JSON.stringify(data[0].details[j].Email));
//       }
//     }
//   }
// })
// .catch(function (err) {
//   console.log(err);
// });
