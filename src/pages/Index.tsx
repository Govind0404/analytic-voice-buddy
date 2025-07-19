import { Layout } from "../components/Layout";
import { ChatInterface } from "../components/ChatInterface";

const Index = () => {
  return (
    <Layout showMetricsPanel={true}>
      <div className="h-full flex flex-col">
        <ChatInterface />
      </div>
    </Layout>
  );
};

export default Index;
