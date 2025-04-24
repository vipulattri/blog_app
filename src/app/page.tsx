'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { Github, Linkedin, Mail, Code, BookOpen, Server, Database } from 'lucide-react';

interface BlogPost {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export default function HomePage() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get('/api/blogs');
        setBlogs(response.data || []);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching blogs:', err);
        setError('Failed to load blog posts');
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto py-16 text-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-10 w-80 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 w-60 bg-gray-200 rounded mb-12"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-80 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4 flex flex-col items-center text-center">
          <h1 className="text-5xl font-bold mb-6 animate-fade-in">Welcome to Vipul's Tech Blog</h1>
          <p className="text-xl max-w-2xl mb-8">
            Exploring the world of web development, machine learning, and innovative technologies
          </p>
          <div className="flex space-x-4">
            <Button className="bg-white text-blue-600 hover:bg-blue-50">
              <a href="#about">About Me</a>
            </Button>
            <Button className="bg-transparent border border-white hover:bg-white/10">
              <a href="#blogs">Read Blog</a>
            </Button>
          </div>
        </div>
      </div>

      {/* About Me Section */}
      <section id="about" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">About Me</h2>
          
          <div className="flex flex-col md:flex-row gap-10 items-start">
            <div className="md:w-1/3 bg-gradient-to-br from-blue-500 to-purple-600 p-1 rounded-xl shadow-lg">
              <div className="bg-white p-6 rounded-lg h-full">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <span className="p-2 rounded-full bg-blue-100">👤</span> Basic Information
                </h3>
                <p className="mb-2"><strong>Name:</strong> Vipul Attri</p>
                <p className="mb-2"><strong>Location:</strong> Himachal Pradesh, India</p>
                <p><strong>Languages:</strong> Hindi (native), English (basic)</p>
                
                <div className="mt-6 flex space-x-4">
                  <a href="#" className="text-gray-600 hover:text-blue-600">
                    <Github size={20} />
                  </a>
                  <a href="#" className="text-gray-600 hover:text-blue-600">
                    <Linkedin size={20} />
                  </a>
                  <a href="#" className="text-gray-600 hover:text-blue-600">
                    <Mail size={20} />
                  </a>
                </div>
              </div>
            </div>
            
            <div className="md:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-blue-600">
                  <BookOpen size={20} /> Education
                </h3>
                <ul className="space-y-2">
                  <li>B.Tech in Computer Science (HPTU)</li>
                  <li>Bachelor of Commerce (B.Com)</li>
                </ul>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-purple-600">
                  <Code size={20} /> Technical Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">HTML/CSS</span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">JavaScript</span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">React</span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">MongoDB</span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">Express</span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">Node.js</span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">Python</span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">Java</span>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-green-600">
                  <Server size={20} /> Projects
                </h3>
                <ul className="space-y-2 text-sm">
                  <li>• Breast Cancer Prediction (ML)</li>
                  <li>• IPL Score Prediction</li>
                  <li>• Car Price Prediction</li>
                  <li>• Electrician Wala App (beta)</li>
                  <li>• Audio-to-song ML project</li>
                </ul>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-yellow-600">
                  <Database size={20} /> Career Goals
                </h3>
                <p>MERN Stack Developer passionate about web development, machine learning, and AI. Currently working on personal projects like mobile games, question paper apps, and an ebook website.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section id="blogs" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-2 text-gray-800">Latest Articles</h2>
          <p className="text-center text-gray-600 mb-12">Insights and thoughts on technology and development</p>

          {error && (
            <div className="my-8 rounded-md bg-red-50 p-4 text-red-700">
              {error}
            </div>
          )}

          {blogs.length === 0 && !error ? (
            <div className="my-16 text-center">
              <p className="mb-4 text-lg text-gray-600">No blog posts found.</p>
              <p className="text-gray-500">Check back later for new content!</p>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {blogs.map((blog) => (
                <div key={blog._id} className="flex flex-col overflow-hidden rounded-lg bg-white shadow-lg transition hover:shadow-xl transform hover:-translate-y-1">
                  <div className="relative h-48 bg-gradient-to-r from-blue-400 to-purple-500">
                    <div className="absolute flex h-full w-full items-center justify-center text-white font-bold text-lg">
                      Blog Post
                    </div>
                  </div>
                  <div className="flex-1 p-6">
                    <p className="mb-2 text-sm text-gray-500">{formatDate(blog.createdAt)}</p>
                    <h2 className="mb-3 text-xl font-bold text-gray-800">{blog.title}</h2>
                    <p className="mb-4 text-gray-600 line-clamp-3">
                      {blog.content}
                    </p>
                    <Link href={`/blog/${blog._id}`} className="mt-auto">
                      <Button className="mt-auto w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700">Read More</Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-10">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; {new Date().getFullYear()} Vipul Attri. All rights reserved.</p>
          <p className="mt-2 text-gray-400">Made with ❤️ using Next.js and MongoDB</p>
        </div>
      </footer>
    </div>
  );
}
