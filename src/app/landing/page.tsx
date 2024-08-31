"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { downloadJSON } from "@/lib/utils";

const SCRAPE_API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function Component() {
  const [url, setUrl] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    review: "",
  });

  const handleDownload = async () => {
    try {
      const response = await fetch(`${SCRAPE_API_URL}/scrape?url=${url}`);
      const data = await response.json();
      downloadJSON(data, "scraped-data.json");
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setUrl("");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    console.log("Form submitted:", formData);
    try {
      const response = await fetch(`${SCRAPE_API_URL}/review`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        console.error("Failed to submit feedback");
      } else {
        console.log("Feedback submitted successfully");
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
    } finally {
      setFormData({
        name: "",
        email: "",
        review: "",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">WikiScraper</h1>

      <Card className="w-full max-w-2xl mx-auto mb-8">
        <CardHeader>
          <CardTitle>Enter URL to Scrape</CardTitle>
          <CardDescription>
            Enter a Wikipedia URL to get JSON data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <Input
              type="url"
              placeholder="https://en.wikipedia.org/wiki/..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-grow"
            />
            <Button onClick={handleDownload}>Download JSON</Button>
          </div>
        </CardContent>
      </Card>

      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Feedback Form</CardTitle>
          <CardDescription>We'd love to hear your thoughts!</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="review">Review</Label>
              <Textarea
                id="review"
                placeholder="Your Review"
                value={formData.review}
                onChange={handleChange}
              />
            </div>
            <Button type="submit" className="w-full">
              Submit Feedback
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
