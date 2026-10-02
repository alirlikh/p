'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FC } from 'react';

export interface BlogPostCardProps {
  post: {
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
  };
}

const BlogPostCard: FC<BlogPostCardProps> = ({ post }) => {
  const { slug, title, excerpt, coverImage, publishedAt, views, author, categories } = post;

  const variants = {
    initial: { y: -100, opacity: 0 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
      },
    },
  };

  const formatDate = (date: Date | string | null | undefined) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <motion.div
      className="max-w-96 rounded-[40px] bg-gray-800 w-full mx-8 mt-20 border-2 border-gray-700"
      whileHover={{ y: -10 }}
      variants={variants}
    >
      {/* Cover Image */}
      <Link href={`/blog/${slug}`}>
        <div className="w-5/6 mx-auto place-items-center -mt-12 relative h-52">
          {coverImage ? (
            <Image
              src={coverImage}
              alt={title}
              fill
              sizes="(max-width: 768px) 100vw, 384px"
              className="object-cover rounded-[40px] border-2 border-dashed p-2 border-purple-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center rounded-[40px] border-2 border-dashed p-2 border-purple-300 bg-gray-700">
              <span className="text-6xl">📝</span>
            </div>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="mx-auto p-6 mt-5 space-y-4 mb-3">
        {/* Categories */}
        {categories && categories.length > 0 && (
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <span
                key={category.id}
                className="text-xs px-3 py-1 rounded-full bg-purple-300/30 text-purple-300 border border-purple-300"
              >
                {category.name}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <Link href={`/blog/${slug}`}>
          <h3 className="font-bold text-2xl text-center hover:text-purple-300 transition-colors line-clamp-2">
            {title}
          </h3>
        </Link>

        {/* Excerpt */}
        {excerpt && (
          <p className="text-gray-300 text-center text-sm line-clamp-3">
            {excerpt}
          </p>
        )}

        {/* Meta Info */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-700 text-sm text-gray-300">
          <div className="flex items-center gap-2">
            {author.image && (
              <Image
                src={author.image}
                alt={author.name || 'Author'}
                width={24}
                height={24}
                sizes="24px"
                className="rounded-full"
              />
            )}
            <span>{author.name || 'Anonymous'}</span>
          </div>
          <div className="flex items-center gap-4">
            <span>{views} views</span>
            <time className="text-xs">
              {formatDate(publishedAt)}
            </time>
          </div>
        </div>

        {/* Read More Link */}
        <Link
          href={`/blog/${slug}`}
          className="block text-center text-purple-300 hover:brightness-90 transition-all font-medium"
        >
          Read More →
        </Link>
      </div>
    </motion.div>
  );
};

export default BlogPostCard;
