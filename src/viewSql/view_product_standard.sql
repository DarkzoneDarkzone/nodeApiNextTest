SELECT  product_standard.name_member,
        product_standard.content_member,
        product_standard.price_standard,
        product_standard.sex,
        product_standard.store_id,
        product_standard.store_name,
        product_standard.store_profile,
        product_standard.store_concept,
        COUNT(product_standard.id) as totalProduct, 
        GROUP_CONCAT(product_image.path_img) as product_img 
FROM (
    SELECT  product.*, 
            store.name as store_name,
            store.profile_img as store_profile, 
            store.concept as store_concept
    FROM `store` 
    JOIN product
    ON (store.id = product.store_id AND product.status = "active")
) as product_standard 
JOIN product_image 
ON (product_image.product_id = product_standard.id AND product_image.member_type = "standard")
GROUP BY product_standard.id;