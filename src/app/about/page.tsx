import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AboutPage() {
  return (
    <div className="container mx-auto py-10 px-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">About HealthBot</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-invert max-w-none">
          <p>
            HealthBot is an AI-powered symptom checker designed to provide you with potential health
            insights based on the symptoms you describe. Our goal is to empower users to better
            understand their health, but it is crucial to remember that HealthBot is not a substitute
            for professional medical advice.
          </p>
          <h2 className="text-2xl font-bold mt-6">Our Mission</h2>
          <p>
            Our mission is to make health information more accessible and to help individuals make
            more informed decisions about their well-being. We believe that technology can play a
            significant role in supporting personal health journeys.
          </p>
          <h2 className="text-2xl font-bold mt-6">Disclaimer</h2>
          <p>
            The information provided by HealthBot is for informational purposes only and does not
            constitute medical advice, diagnosis, or treatment. Always seek the advice of your
            physician or other qualified health provider with any questions you may have regarding a
            medical condition. Never disregard professional medical advice or delay in seeking it
            because of something you have read or received from HealthBot.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
