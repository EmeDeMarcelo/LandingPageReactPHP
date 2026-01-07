import HomeBanner from "./components/HomeBanner";
import HomeServices from "./components/HomeServices";
import HomeContactForm from "./components/HomeContactForm";

export default function Home() {
  return (
    <div className="w-full">
      <HomeBanner />
      <HomeServices />
      <HomeContactForm />
    </div>
  );
}
