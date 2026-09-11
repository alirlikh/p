'use client';

import { motion } from 'framer-motion';
import BlogPostCard from '@/components/materials/card/blogPostCard/BlogPost.card';
import { FC } from 'react';

export interface BlogListSectionProps {
  posts: Array<{
    slug: string;
    title: string;
    excerpt?: string | null;
    coverImage?: string | null;
    publishedAt?: Date | string | null;
    views: number;
    author: {
      name: string | null;
      image: string | null;
    };
    categories: Array<{
      id: string;
      name: string;
      slug: string;
    }>;
  }>;
}

const BlogListSection: FC<BlogListSectionProps> = ({ posts }) => {
  const containerVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2,
      },
    },
  };

  if (!posts || posts.length === 0) {
    return (
      <section className="p-4 px-8 md:px-12 min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-6xl">📝</p>
          <h2 className="text-2xl font-bold text-gray-400">No blog posts yet</h2>
          <p className="text-gray-500">Check back soon for new content!</p>
        </div>
      </section>
    );
  }

  return (
    <section className="p-4 px-8 md:px-12">
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {posts.map((post) => (
          <BlogPostCard key={post.slug} post={post} />
        ))}
      </motion.div>
    </section>
  );
};

export default BlogListSection;
