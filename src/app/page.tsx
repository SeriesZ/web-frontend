import Image from "next/image";
import styles from "./page.module.css";
import MainComponent from "@/components/main/MainComponent";
import IdeaList from "@/components/main/IdeaList";

export default function Home() {
  return (
    <>
      <MainComponent />
      <IdeaList />
    </>
  );
}
