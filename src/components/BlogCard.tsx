import Link from 'next/link';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';
import { IBlog } from '@/models/Blog';

interface BlogCardProps {
  blog: IBlog;
}

const BlogCard = ({ blog }: BlogCardProps) => {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <CardHeader>
        <CardTitle>{blog.title}</CardTitle>
        <CardDescription>
          Posted on {formatDate(blog.createdAt)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="line-clamp-3 text-stone-600">
          {blog.content.substring(0, 150)}
          {blog.content.length > 150 && '...'}
        </p>
      </CardContent>
      <CardFooter>
        <Link href={`/blog/${blog._id}`} passHref>
          <Button variant="outline">Read More</Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default BlogCard; 