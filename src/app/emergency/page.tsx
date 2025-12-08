import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Phone, Shield } from "lucide-react";

const hotlines = [
  { name: 'National Domestic Violence Hotline', number: '1-800-799-7233', tel: '18007997233', description: '24/7 confidential support for anyone experiencing domestic violence or seeking resources.' },
  { name: 'RAINN (Rape, Abuse & Incest National Network)', number: '1-800-656-4673', tel: '18006564673', description: 'The nation\'s largest anti-sexual violence organization.' },
  { name: 'National Suicide Prevention Lifeline', number: '988', tel: '988', description: 'Free and confidential support for people in distress, prevention and crisis resources.' }
];

const guidanceSteps = [
    { title: 'Find a Safe Place', description: 'If you are in immediate danger, your priority is to get to a safe location. This could be a friend\'s house, a family member\'s home, a public place, or a designated shelter.' },
    { title: 'Contact Emergency Services', description: 'If you are injured or feel your life is at risk, call 911 or your local emergency number immediately.' },
    { title: 'Preserve Evidence', description: 'If possible and safe to do so, preserve any evidence of the abuse. This can include photos of injuries, threatening messages, or damaged property. Do not clean up or alter the scene.' },
    { title: 'Reach Out for Support', description: 'You do not have to go through this alone. Call a trusted friend, family member, or one of the confidential hotlines listed on this page.' },
    { title: 'Consider Medical Attention', description: 'Even if you don\'t think your injuries are severe, it\'s important to be checked by a medical professional. They can document your injuries, which can be important later.' },
];

export default function EmergencyPage() {
    return (
        <div className="space-y-8 animate-in fade-in-50">
            <Alert variant="destructive">
                <Shield className="h-4 w-4" />
                <AlertTitle>Are you in immediate danger?</AlertTitle>
                <AlertDescription className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                   <span>If you are injured or feel your life is at risk, please call <strong>911</strong> now.</span>
                   <Button asChild size="lg" variant="destructive" className="mt-4 sm:mt-0 w-full sm:w-auto">
                        <a href="tel:911"><Phone className="mr-2"/> Call 911</a>
                    </Button>
                </AlertDescription>
            </Alert>

            <section>
                <h2 className="text-2xl font-bold mb-4">Emergency Hotlines</h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {hotlines.map(hotline => (
                        <Card key={hotline.name} className="flex flex-col">
                            <CardHeader>
                                <CardTitle>{hotline.name}</CardTitle>
                                <CardDescription>{hotline.description}</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-grow flex flex-col items-start justify-end gap-4">
                                <p className="text-lg font-semibold tracking-wider">{hotline.number}</p>
                                <Button asChild className="w-full">
                                    <a href={`tel:${hotline.tel}`}>
                                        <Phone className="mr-2"/> Call Now
                                    </a>
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>
            
            <section>
                <h2 className="text-2xl font-bold mb-4">What to Do in a Crisis</h2>
                <div className="space-y-4">
                    {guidanceSteps.map((step, index) => (
                        <Card key={index} className="flex items-start p-6">
                             <div className="flex-shrink-0 flex items-center justify-center bg-primary/20 text-primary font-bold rounded-full size-10 mr-4">
                                {index + 1}
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg">{step.title}</h3>
                                <p className="text-muted-foreground">{step.description}</p>
                            </div>
                        </Card>
                    ))}
                </div>
            </section>
        </div>
    );
}
