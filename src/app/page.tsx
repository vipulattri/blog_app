'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { Github, Linkedin, Mail, Code, BookOpen, Server, Database, Award, Briefcase, MapPin, Calendar } from 'lucide-react';

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
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-24">
        <div className="container mx-auto px-4 flex flex-col items-center text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">Welcome to Vipul's Tech Blog</h1>
          <p className="text-xl max-w-2xl mb-10 leading-relaxed">
            Exploring the world of web development, machine learning, and innovative technologies
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button className="bg-white text-blue-700 hover:bg-blue-50 shadow-lg transition-all duration-300 transform hover:scale-105">
              <a href="#about">About Me</a>
            </Button>
            <Button className="bg-transparent border-2 border-white hover:bg-white/10 shadow-lg transition-all duration-300 transform hover:scale-105">
              <a href="#blogs">Read Blog</a>
            </Button>
          </div>
        </div>
      </div>

      {/* About Me Section */}
      <section id="about" className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 relative inline-block">
              About Me
              <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-600"></span>
            </h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              Web developer passionate about creating impactful applications and sharing knowledge through blogging
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-10 items-start">
            <div className="md:w-1/3 bg-gradient-to-br from-blue-500 to-purple-600 p-1 rounded-xl shadow-xl">
              <div className="bg-white p-6 rounded-lg h-full">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <span className="p-2 rounded-full bg-blue-100">👤</span> Basic Information
                </h3>
                <div className="space-y-4">
                  <p className="flex gap-2 items-center">
                    <span className="text-blue-500 min-w-[24px]"><MapPin size={18} /></span>
                    <span><strong>Name:</strong> Vipul Attri</span>
                  </p>
                  <p className="flex gap-2 items-center">
                    <span className="text-blue-500 min-w-[24px]"><MapPin size={18} /></span>
                    <span><strong>Location:</strong> Himachal Pradesh, India</span>
                  </p>
                  <p className="flex gap-2 items-center">
                    <span className="text-blue-500 min-w-[24px]"><Calendar size={18} /></span>
                    <span><strong>Languages:</strong> Hindi (native), English (basic)</span>
                  </p>
                </div>
                
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h4 className="font-semibold mb-3 text-gray-700">Connect with me</h4>
                  <div className="flex space-x-4">
                    <a href="https://github.com/vipulattri" target="_blank" rel="noopener noreferrer" 
                       className="bg-gray-100 p-2 rounded-full text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                      <Github size={20} />
                    </a>
                    <a href="https://www.linkedin.com/in/vipul-attri-21639824b/" target="_blank" rel="noopener noreferrer" 
                       className="bg-gray-100 p-2 rounded-full text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                      <Linkedin size={20} />
                    </a>
                    <a href="mailto:attrvipul72@gmail.com" 
                       className="bg-gray-100 p-2 rounded-full text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                      <Mail size={20} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="md:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-blue-500 hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-blue-600">
                  <BookOpen size={20} /> Education
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <span>B.Tech in Computer Science (HPTU)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <span>Bachelor of Commerce (B.Com)</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-purple-500 hover:shadow-lg transition-shadow">
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
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">Next.js</span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">TailwindCSS</span>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-green-500 hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-green-600">
                  <Server size={20} /> Projects
                </h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span>Breast Cancer Prediction (ML)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span>IPL Score Prediction</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span>Car Price Prediction</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span>Electrician Wala App (beta)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span>Audio-to-song ML project</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-yellow-500 hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-yellow-600">
                  <Briefcase size={20} /> Career Goals
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  MERN Stack Developer passionate about web development, machine learning, and AI. Currently working on personal projects like mobile games, question paper apps, and an ebook website.
                </p>
              </div>
              
              <div className="col-span-1 md:col-span-2 bg-white p-6 rounded-lg shadow-md border-t-4 border-red-500 hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-red-600">
                  <Award size={20} /> Achievements
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-red-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-red-700 mb-2">Academic</h4>
                    <p className="text-gray-700">Graduated with honors in Computer Science from HPTU</p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-700 mb-2">Technical</h4>
                    <p className="text-gray-700">Successfully developed multiple full-stack applications using the MERN stack</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section id="blogs" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 relative inline-block">
              Latest Articles
              <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-600"></span>
            </h2>
            <p className="text-gray-600 mt-4">Insights and thoughts on technology and development</p>
          </div>

          {error && (
            <div className="my-8 rounded-md bg-red-50 p-4 text-red-700">
              {error}
            </div>
          )}

          {blogs.length === 0 && !error ? (
            <div className="my-16 text-center p-8 bg-white rounded-lg shadow-md">
              <div className="text-6xl mb-4">📝</div>
              <p className="mb-4 text-lg text-gray-600">No blog posts found.</p>
              <p className="text-gray-500">Check back later for new content!</p>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {blogs.map((blog) => (
                <div key={blog._id} className="flex flex-col overflow-hidden rounded-lg bg-white shadow-lg transition-all duration-300 hover:shadow-xl transform hover:-translate-y-2">
                  <div className="relative h-48 bg-gradient-to-r from-blue-400 to-purple-500">
                    <div className="absolute flex h-full w-full items-center justify-center text-white font-bold text-lg">
                      Blog Post
                    </div>
                  </div>
                  <div className="flex-1 p-6">
                    <p className="mb-2 text-sm text-gray-500 flex items-center gap-1">
                      <Calendar size={14} /> {formatDate(blog.createdAt)}
                    </p>
                    <h2 className="mb-3 text-xl font-bold text-gray-800">{blog.title}</h2>
                    <p className="mb-4 text-gray-600 line-clamp-3">
                      {blog.content}
                    </p>
                    <Link href={`/blog/${blog._id}`} className="mt-auto">
                      <Button className="mt-auto w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-md">Read More</Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Interested in Working Together?</h2>
          <p className="max-w-2xl mx-auto mb-8">I'm always open to discussing new projects, creative ideas or opportunities to be part of your vision.</p>
          <Button className="bg-white text-blue-700 hover:bg-blue-50 shadow-lg transition-all duration-300 transform hover:scale-105">
            <a href="mailto:attrvipul72@gmail.com">Get In Touch</a>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-10">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center space-x-6 mb-6">
            <a href="https://github.com/vipulattri" target="_blank" rel="noopener noreferrer" 
               className="text-gray-400 hover:text-white transition-colors">
              <Github size={24} />
            </a>
            <a href="https://www.linkedin.com/in/vipul-attri-21639824b/" target="_blank" rel="noopener noreferrer" 
               className="text-gray-400 hover:text-white transition-colors">
              <Linkedin size={24} />
            </a>
            <a href="mailto:attrvipul72@gmail.com" 
               className="text-gray-400 hover:text-white transition-colors">
              <Mail size={24} />
            </a>
          </div>
          <p>&copy; {new Date().getFullYear()} Vipul Attri. All rights reserved.</p>
          <p className="mt-2 text-gray-400">Made with ❤️ using Next.js and MongoDB</p>
        </div>
      </footer>
    </div>
  );
}
