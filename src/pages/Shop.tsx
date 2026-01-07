import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { ProductGrid } from "@/components/products/ProductGrid";
import { useProducts } from "@/hooks/useProducts";
import { mockProducts } from "@/data/products";
import { Category, Condition, SortOption, Product } from "@/types/product";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal, X } from "lucide-react";

const categories: { value: Category; label: string }[] = [
  { value: "all", label: "All" },
  { value: "clothing", label: "Clothing" },
  { value: "shoes", label: "Shoes" },
  { value: "bags", label: "Bags" },
  { value: "accessories", label: "Accessories" },
];

const conditions: { value: Condition; label: string }[] = [
  { value: "all", label: "All Conditions" },
  { value: "new", label: "New" },
  { value: "like-new", label: "Like New" },
  { value: "good", label: "Good" },
  { value: "fair", label: "Fair" },
];

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
];

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const { products: dbProducts, isLoading } = useProducts();

  const categoryParam = searchParams.get("category") as Category | null;
  const [selectedCategory, setSelectedCategory] = useState<Category>(
    categoryParam && categories.some((c) => c.value === categoryParam)
      ? categoryParam
      : "all"
  );
  const [selectedCondition, setSelectedCondition] = useState<Condition>("all");
  const [sortBy, setSortBy] = useState<SortOption>("newest");

  useEffect(() => {
    const next =
      categoryParam && categories.some((c) => c.value === categoryParam)
        ? categoryParam
        : "all";
    setSelectedCategory(next);
  }, [categoryParam]);

  // Combine database products with mock products (mock products as fallback)
  const allProducts = useMemo(() => {
    if (dbProducts.length > 0) {
      return dbProducts;
    }
    return mockProducts;
  }, [dbProducts]);

  const filteredProducts = useMemo(() => {
    let products = [...allProducts];

    // Filter by category
    if (selectedCategory !== "all") {
      products = products.filter((p) => p.category === selectedCategory);
    }

    // Filter by condition
    if (selectedCondition !== "all") {
      products = products.filter((p) => p.condition === selectedCondition);
    }

    // Sort
    switch (sortBy) {
      case "price-low":
        products.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        products.sort((a, b) => b.price - a.price);
        break;
      case "newest":
      default:
        products.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }

    return products;
  }, [allProducts, selectedCategory, selectedCondition, sortBy]);

  const handleCategoryChange = (category: Category) => {
    setSelectedCategory(category);
    if (category === "all") {
      searchParams.delete("category");
    } else {
      searchParams.set("category", category);
    }
    setSearchParams(searchParams);
  };

  const clearFilters = () => {
    setSelectedCategory("all");
    setSelectedCondition("all");
    setSortBy("newest");
    setSearchParams({});
  };

  const hasActiveFilters =
    selectedCategory !== "all" || selectedCondition !== "all";

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-serif font-medium mb-2">
            {selectedCategory === "all"
              ? "Shop All"
              : categories.find((c) => c.value === selectedCategory)?.label}
          </h1>
          <p className="text-muted-foreground">
            {isLoading ? "Loading..." : `${filteredProducts.length} items`}
          </p>
        </div>

        {/* Filters Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-6 border-b border-border">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="gap-2"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </Button>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="gap-1 text-muted-foreground"
              >
                Clear all
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="text-sm bg-transparent border border-input rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Expandable Filters */}
        {showFilters && (
          <div className="mb-8 p-6 bg-secondary rounded-sm animate-fade-in">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Categories */}
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider mb-3">
                  Category
                </h3>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <Button
                      key={category.value}
                      variant={
                        selectedCategory === category.value
                          ? "default"
                          : "outline"
                      }
                      size="sm"
                      onClick={() => handleCategoryChange(category.value)}
                    >
                      {category.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Condition */}
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider mb-3">
                  Condition
                </h3>
                <div className="flex flex-wrap gap-2">
                  {conditions.map((condition) => (
                    <Button
                      key={condition.value}
                      variant={
                        selectedCondition === condition.value
                          ? "default"
                          : "outline"
                      }
                      size="sm"
                      onClick={() => setSelectedCondition(condition.value)}
                    >
                      {condition.label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Products */}
        {isLoading ? (
          <div className="text-center py-16">
            <p className="text-lg text-muted-foreground animate-pulse">
              Loading products...
            </p>
          </div>
        ) : filteredProducts.length > 0 ? (
          <ProductGrid products={filteredProducts} />
        ) : (
          <div className="text-center py-16">
            <p className="text-lg text-muted-foreground">
              No products found matching your filters.
            </p>
            <Button variant="outline" className="mt-4" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
}
