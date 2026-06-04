import type { FormEvent } from "react"
import { useEffect, useState } from "react"

import { HttpError } from "../api/client"
import { createProduct, deactivateProduct, getProducts, updateProduct } from "../api/products"
import type { PaginatedResponse, Product } from "../api/types"
import { PaginatedTable } from "../components/PaginatedTable"
import { SectionCard } from "../components/SectionCard"
import { StatusMessages } from "../components/StatusMessages"
import { useAuth } from "../state/auth"

export function ProductsPage() {
  const { user } = useAuth()
  const [data, setData] = useState<PaginatedResponse<Product> | null>(null)
  const [page, setPage] = useState(1)
  const [searchInput, setSearchInput] = useState("")
  const [isActiveInput, setIsActiveInput] = useState<"" | "true" | "false">("")
  const [search, setSearch] = useState("")
  const [isActive, setIsActive] = useState<"" | "true" | "false">("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [fieldErrors, setFieldErrors] = useState<string[]>([])
  const [sku, setSku] = useState("")
  const [name, setName] = useState("")
  const [costPrice, setCostPrice] = useState("")
  const [wholesalePrice, setWholesalePrice] = useState("")
  const [publicPrice, setPublicPrice] = useState("")
  const [initialStock, setInitialStock] = useState("0")
  const [description, setDescription] = useState("")
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [isProductModalOpen, setIsProductModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [submittingProduct, setSubmittingProduct] = useState(false)
  const [imageLoadErrors, setImageLoadErrors] = useState<Record<number, boolean>>({})

  function resetProductForm() {
    setSku("")
    setName("")
    setDescription("")
    setCostPrice("")
    setWholesalePrice("")
    setPublicPrice("")
    setInitialStock("0")
    setImageFiles([])
    setImagePreviews([])
    setEditingProduct(null)
  }

  function openCreateProductModal() {
    resetProductForm()
    setIsProductModalOpen(true)
  }

  function closeProductModal() {
    setIsProductModalOpen(false)
    resetProductForm()
  }

  function openEditProductModal(product: Product) {
    setEditingProduct(product)
    setSku(product.sku)
    setName(product.name)
    setDescription(product.description ?? "")
    setCostPrice(product.cost_price)
    setWholesalePrice(product.wholesale_reference_price)
    setPublicPrice(product.public_price)
    setInitialStock(String(product.stock))
    setImageFiles([])
    setImagePreviews(product.images.map((image) => image.image_url))
    setIsProductModalOpen(true)
  }

  async function handleDeactivateProduct(product: Product) {
    const ok = window.confirm(`¿Desactivar producto ${product.sku} - ${product.name}?`)
    if (!ok) return
    setError("")
    setSuccess("")
    setFieldErrors([])
    try {
      await deactivateProduct(product.id)
      setSuccess("Producto desactivado correctamente.")
      await loadProducts()
    } catch (err) {
      if (err instanceof HttpError) {
        setError(err.payload.detail)
        setFieldErrors(flattenFieldErrors(err))
      } else {
        setError("No se pudo desactivar el producto.")
      }
    }
  }

  function handleImageFileChange(files: FileList | null) {
    const selectedFiles = Array.from(files ?? [])
    if (selectedFiles.length === 0) {
      return
    }

    setImageFiles((prev) => {
      const merged = [...prev]
      for (const file of selectedFiles) {
        const exists = merged.some(
          (item) =>
            item.name === file.name &&
            item.size === file.size &&
            item.lastModified === file.lastModified,
        )
        if (!exists) {
          merged.push(file)
        }
      }
      return merged.slice(0, 5)
    })

    setImagePreviews((prev) => {
      const merged = [...prev]
      const alreadySelected = new Set(imageFiles.map((item) => `${item.name}:${item.size}:${item.lastModified}`))
      for (const file of selectedFiles) {
        const key = `${file.name}:${file.size}:${file.lastModified}`
        if (!alreadySelected.has(key)) {
          merged.push(URL.createObjectURL(file))
        }
      }
      return merged.slice(0, 5)
    })
  }

  function removeSelectedImage(indexToRemove: number) {
    setImageFiles((prev) => prev.filter((_, index) => index !== indexToRemove))
    setImagePreviews((prev) => prev.filter((_, index) => index !== indexToRemove))
  }

  async function loadProducts() {
    setLoading(true)
    setError("")
    try {
      const result = await getProducts({
        page,
        search,
        is_active: isActive || undefined,
      })
      setData(result)
    } catch (err) {
      if (err instanceof HttpError) {
        setError(err.payload.detail)
      } else {
        setError("No se pudo cargar productos.")
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadProducts()
  }, [page, search, isActive])

  function flattenFieldErrors(err: HttpError) {
    return Object.values(err.payload.field_errors).flat()
  }

  async function submitCreateProduct(e: FormEvent) {
    e.preventDefault()
    if (submittingProduct) return
    setError("")
    setSuccess("")
    setFieldErrors([])
    if (!name.trim()) {
      setError("Nombre es obligatorio.")
      return
    }
    if (Number(costPrice) <= 0 || Number(wholesalePrice) <= 0 || Number(publicPrice) <= 0) {
      setError("Los precios deben ser mayores a cero.")
      return
    }
    if (Number(initialStock) < 0) {
      setError("El stock inicial no puede ser negativo.")
      return
    }
    try {
      setSubmittingProduct(true)
      const existingImagesCount = editingProduct?.images.length ?? 0
      const selectedImagesCount = imageFiles.length
      const totalImagesCount = selectedImagesCount > 0 ? selectedImagesCount : existingImagesCount

      if (totalImagesCount < 1) {
        setError("Debe subir al menos una imagen.")
        return
      }

      if (totalImagesCount > 5) {
        setError("Puede cargar hasta 5 imagenes por producto.")
        return
      }

      if (editingProduct) {
        await updateProduct(editingProduct.id, {
          sku,
          name,
          description,
          cost_price: costPrice,
          wholesale_reference_price: wholesalePrice,
          public_price: publicPrice,
          stock: Number(initialStock),
          ...(imageFiles.length > 0 ? { image_files: imageFiles } : {})
        })
      } else {
        await createProduct({
          name,
          description,
          cost_price: costPrice,
          wholesale_reference_price: wholesalePrice,
          public_price: publicPrice,
          stock: Number(initialStock),
          image_files: imageFiles
        })
      }

      setSuccess(editingProduct ? "Producto actualizado correctamente." : "Producto creado correctamente.")
      closeProductModal()
      setPage(1)
      await loadProducts()
    } catch (err) {
      if (err instanceof HttpError) {
        setError(err.payload.detail)
        setFieldErrors(flattenFieldErrors(err))
      } else {
        setError("No se pudo crear el producto.")
      }
    }
    finally {
      setSubmittingProduct(false)
    }
  }

  function applyFilters() {
    setPage(1)
    setSearch(searchInput)
    setIsActive(isActiveInput)
  }

  function clearFilters() {
    setPage(1)
    setSearchInput("")
    setIsActiveInput("")
    setSearch("")
    setIsActive("")
  }

  return (
    <main className="page-stack">
      <section className="page-head">
        <h1>Productos</h1>
        <p className="page-subtle">Consulta inventario y administra el catalogo de productos.</p>
      </section>
      <StatusMessages error={error} success={success} fieldErrors={fieldErrors} />

      {user?.role === "admin" ? (
        <SectionCard title="Nuevo producto">
          <div className="sales-open-wrap">
            <button type="button" onClick={openCreateProductModal}>Nuevo producto</button>
          </div>
        </SectionCard>
      ) : null}

      {isProductModalOpen ? (
        <div className="sales-modal-overlay" role="dialog" aria-modal="true" aria-label="Formulario de producto">
          <section className="sales-modal-card">
            <div className="panel-head">
              <h3>{editingProduct ? "Editar producto" : "Nuevo producto"}</h3>
              <button type="button" className="secondary" onClick={closeProductModal}>Cancelar</button>
            </div>

            <form className="sales-form" onSubmit={submitCreateProduct}>
              <label>
                SKU
                <input
                  aria-label="SKU"
                  placeholder="Autogenerado"
                  value={editingProduct ? sku : "Autogenerado al guardar"}
                  onChange={(e) => setSku(e.target.value)}
                  disabled={!editingProduct}
                />
              </label>
              <label>
                Nombre
                <input aria-label="Nombre" placeholder="Nombre" value={name} onChange={(e) => setName(e.target.value)} />
              </label>
              <label>
                Descripcion
                <textarea
                  aria-label="Descripcion"
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Descripcion del producto"
                />
              </label>
              <label>
                Costo
                <input aria-label="Costo" placeholder="Costo" value={costPrice} onChange={(e) => setCostPrice(e.target.value)} />
              </label>
              <label>
                Precio mayorista
                <input aria-label="Precio mayorista" placeholder="Precio mayorista" value={wholesalePrice} onChange={(e) => setWholesalePrice(e.target.value)} />
              </label>
              <label>
                Precio publico
                <input aria-label="Precio publico" placeholder="Precio publico" value={publicPrice} onChange={(e) => setPublicPrice(e.target.value)} />
              </label>
              <label>
                Stock inicial
                <input aria-label="Stock inicial" placeholder="Stock inicial" value={initialStock} onChange={(e) => setInitialStock(e.target.value)} />
              </label>

              <div className="panel">
                <div className="panel-head">
                  <h3>Fotos del producto</h3>
                </div>
                <label>
                  Subir fotos
                  <input
                    aria-label="Subir fotos"
                    type="file"
                    name="image_files"
                    multiple
                    accept="image/png,image/jpeg,image/webp"
                    onChange={(e) => handleImageFileChange(e.target.files)}
                  />
                </label>
                <p className="page-subtle">Selecciona entre 1 y 5 fotos. Puedes agregarlas en varias selecciones.</p>
                {imagePreviews.length > 0 ? (
                  <div className="product-gallery">
                    {imagePreviews.map((preview, index) => (
                      <div key={`${preview}-${index}`} className="product-preview-item">
                        <img className="product-thumb" src={preview} alt={`Vista previa ${index + 1}`} />
                        <button type="button" className="secondary" onClick={() => removeSelectedImage(index)}>
                          Quitar
                        </button>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>

              <button type="submit" disabled={submittingProduct}>{submittingProduct ? "Enviando..." : editingProduct ? "Guardar cambios" : "Crear producto"}</button>
            </form>
          </section>
        </div>
      ) : null}

      <section className="panel">
      <div className="panel-head">
        <h2>Filtros</h2>
      </div>
      <div className="filters">
      <input aria-label="Buscar productos" placeholder="Buscar por nombre o SKU" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} />
      <select aria-label="Estado activo" value={isActiveInput} onChange={(e) => setIsActiveInput(e.target.value as "" | "true" | "false")}> 
        <option value="">Todos</option>
        <option value="true">Activos</option>
        <option value="false">Inactivos</option>
      </select>
      <button type="button" onClick={applyFilters}>Aplicar</button>
      <button type="button" className="secondary" onClick={clearFilters}>Limpiar</button>
      </div>
      </section>
      {loading ? <p className="page-subtle">Cargando productos...</p> : null}
      {!loading && (data?.results.length ?? 0) === 0 ? <p className="page-subtle">Sin resultados.</p> : null}
      <PaginatedTable
        columns={[
          { key: "name", label: "Nombre", render: (row) => row.name },
          {
            key: "cost_price",
            label: "Costo",
            render: (row) => row.cost_price
          },
          {
            key: "wholesale_reference_price",
            label: "Precio mayorista",
            render: (row) => row.wholesale_reference_price
          },
          {
            key: "public_price",
            label: "Precio publico",
            render: (row) => row.public_price
          },
          {
            key: "representative_image_url",
            label: "Imagen",
            render: (row) =>
              row.representative_image_url && !imageLoadErrors[row.id] ? (
                <img
                  className="product-thumb product-thumb-table"
                  src={row.representative_image_url}
                  alt={row.name}
                  onError={() => setImageLoadErrors((prev) => ({ ...prev, [row.id]: true }))}
                />
              ) : (
                <span className="image-fallback">Sin imagen</span>
              )
          },
          { key: "stock", label: "Stock", render: (row) => row.stock },
          {
            key: "is_active",
            label: "Estado",
            render: (row) => (row.is_active ? "Activo" : "Inactivo")
          },
          {
            key: "actions",
            label: "Acciones",
            render: (row) => user?.role === "admin" ? (
              <div className="table-actions">
                <button type="button" className="secondary" onClick={() => openEditProductModal(row)}>Editar</button>
                <button type="button" className="secondary" onClick={() => void handleDeactivateProduct(row)}>Eliminar</button>
              </div>
            ) : ""
          }
        ]}
        rows={loading ? [] : data?.results ?? []}
        page={page}
        total={data?.count ?? 0}
        pageSize={10}
        onPageChange={setPage}
      />
    </main>
  )
}
