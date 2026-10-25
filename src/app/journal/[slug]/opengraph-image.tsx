import { ImageResponse } from "next/og";
import { getArticle, publishedArticles } from "@/content/journal";
import { ogFonts, ogImage, ogSize } from "@/lib/og";

export const alt = "Reader guides from The Expeditioners";
export const size = ogSize;
export const contentType = "image/png";
export function generateStaticParams() { return publishedArticles.map(article=>({slug:article.slug})); }

export default async function Image({params}:{params:Promise<{slug:string}>}) {
  const {slug}=await params;
  const article=getArticle(slug) ?? publishedArticles[0];
  const [fonts,cover]=await Promise.all([ogFonts(),ogImage("og/book-1.jpg")]);
  return new ImageResponse(<div style={{display:"flex",width:"100%",height:"100%",background:"#ece3d1",color:"#251b19",fontFamily:"Newsreader",padding:64,position:"relative"}}>
    <div style={{display:"flex",position:"absolute",inset:18,border:"1px solid #8d6c4666"}} />
    <div style={{display:"flex",flexDirection:"column",justifyContent:"center",width:740,paddingRight:40}}>
      <div style={{fontFamily:"Plex Mono",fontSize:17,letterSpacing:3,textTransform:"uppercase",color:"#a33c26"}}>{article.kicker}</div>
      <div style={{fontSize:64,lineHeight:1.04,marginTop:28}}>{article.title}</div>
      <div style={{fontFamily:"League Gothic",fontSize:42,textTransform:"uppercase",marginTop:34}}>The Expeditioners</div>
      <div style={{fontFamily:"Plex Mono",fontSize:15,color:"#6f6252",marginTop:8}}>Maps, mysteries &amp; adventures for curious readers</div>
    </div>
    <img src={cover} alt="" width={245} height={379} style={{position:"absolute",right:75,top:126,transform:"rotate(4deg)",boxShadow:"0 20px 40px #251b1955"}} />
  </div>,{...size,fonts});
}
