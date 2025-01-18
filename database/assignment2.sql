-- insert new record to the account TABLE

INSERT INTO public.account
(account_firstname, account_lastname, account_email, account_password)
VALUES ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n')

-- modify tony stark record account_type to 'Admin'

UPDATE public.account
SET account_type = 'Admin'
WHERE account_id = 1;


-- delete tony stark record

DELETE FROM public.account
WHERE account_id = 1;


-- modify GM Hummer record 'small interior' -> 'huge interior'

UPDATE public.inventory
SET inv_description = REPLACE(inv_description, 'the small interiors', 'a huge interior')
WHERE inv_id = 10;


-- query to get make and model fields classified as 'Sport'

SELECT
	inventory.inv_make as make,
	inventory.inv_model as model,
	classification.classification_name as classification_category
FROM public.inventory
INNER JOIN public.classification
ON inventory.classification_id = classification.classification_id
WHERE classification_name = 'Sport';


-- add 'vehicles' to the middle of image and thumbnail url links.

UPDATE public.inventory
SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
	inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');