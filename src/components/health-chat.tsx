'use client';

import { analyzeSymptomsAndSuggestConditions } from '@/ai/flows/analyze-symptoms-and-suggest-conditions';
import type { AnalyzeSymptomsAndSuggestConditionsOutput } from '@/ai/flows/analyze-symptoms-and-suggest-conditions';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertTriangle, Bot, Loader, Send, Sparkles, User } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import React from 'react';

const chatSchema = z.object({
  message: z.string().min(10, 'Please provide a more detailed description of your symptoms.'),
});

type ChatFormValues = z.infer<typeof chatSchema>;

type Message = {
  id: string;
  role: 'user' | 'bot';
  content: React.ReactNode;
};

const BotResponse = ({ data }: { data: AnalyzeSymptomsAndSuggestConditionsOutput }) => {
  return (
    <Card className="bg-muted/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="text-primary" />
          AI Analysis Complete
        </CardTitle>
        <CardDescription>
          Based on the symptoms you provided, here are some potential conditions.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Possible Conditions</h3>
          <div className="flex flex-wrap gap-2">
            {data.possibleConditions.map((condition) => (
              <Badge key={condition} variant="secondary">
                {condition}
              </Badge>
            ))}
          </div>
        </div>

        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="reasoning">
            <AccordionTrigger>View Detailed Reasoning</AccordionTrigger>
            <AccordionContent className="prose prose-sm max-w-none text-foreground/80">
              {data.reasoning}
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Important Recommendation</AlertTitle>
          <AlertDescription>{data.recommendation}</AlertDescription>
        </Alert>

        <p className="text-xs text-muted-foreground text-center">
          Disclaimer: This is not a medical diagnosis. Always consult with a qualified healthcare
          professional for any health concerns.
        </p>
      </CardContent>
    </Card>
  );
};

export default function HealthChat() {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const form = useForm<ChatFormValues>({
    resolver: zodResolver(chatSchema),
    defaultValues: { message: '' },
  });

  useEffect(() => {
    setMessages([
      {
        id: '1',
        role: 'bot',
        content:
          "Hello! I'm HealthBot, your AI health assistant. Please describe your symptoms, and I'll do my best to provide some potential insights. The more detail you provide, the better.",
      },
    ]);
  }, []);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  async function onSubmit(data: ChatFormValues) {
    setIsSubmitting(true);
    const userMessage = data.message;
    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), role: 'user', content: userMessage },
    ]);
    form.reset();

    try {
      const result = await analyzeSymptomsAndSuggestConditions({
        symptoms: userMessage,
      });
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'bot',
          content: <BotResponse data={result} />,
        },
      ]);
    } catch (error) {
      console.error('Error analyzing symptoms:', error);
      toast({
        variant: 'destructive',
        title: 'An error occurred',
        description: 'There was a problem analyzing your symptoms. Please try again.',
      });
      setMessages((prev) => prev.filter((msg) => msg.content !== userMessage));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="w-full max-w-3xl h-[80vh] flex flex-col shadow-xl">
      <CardHeader>
        <CardTitle>Symptom Checker</CardTitle>
        <CardDescription>
          Describe your symptoms below to get an AI-powered analysis.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4 overflow-hidden">
        <ScrollArea className="flex-1 pr-4" ref={scrollAreaRef}>
          <div className="space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  'flex items-start gap-3 animate-in fade-in',
                  message.role === 'user' && 'justify-end'
                )}
              >
                {message.role === 'bot' && (
                  <Avatar>
                    <AvatarFallback>
                      <Bot />
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={cn(
                    'max-w-[80%] rounded-lg p-3 text-sm',
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-secondary-foreground'
                  )}
                >
                  {message.content}
                </div>
                {message.role === 'user' && (
                  <Avatar>
                    <AvatarFallback>
                      <User />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            {isSubmitting && (
              <div className="flex items-start gap-3 animate-in fade-in">
                <Avatar>
                  <AvatarFallback>
                    <Bot />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-secondary text-secondary-foreground rounded-lg p-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Loader className="animate-spin h-4 w-4" />
                    <span>Analyzing...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        <div className="mt-auto pt-4 border-t">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-start gap-3">
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Textarea
                        placeholder="e.g., I have a persistent headache and a slight fever..."
                        {...field}
                        rows={2}
                        className="min-h-0"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            form.handleSubmit(onSubmit)();
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" size="icon" disabled={isSubmitting}>
                <Send className="h-4 w-4" />
                <span className="sr-only">Send</span>
              </Button>
            </form>
          </Form>
        </div>
      </CardContent>
    </Card>
  );
}
