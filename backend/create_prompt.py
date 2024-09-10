def create_prompt(used_new_both, budget, country="UK", brand_name=None, model_name=None, make_year=None, postcode=None, 
                  fuel_type=None, engine_specs=None, wheel_drive=None, gearbox=None, car_type=None, mileage=None):
    """
    This function generates a detailed car research query based on the user inputs.

    Mandatory parameters:
        - used_new_both: "used" or "new" or "both used or new" (dropdown menu)
        - budget: the maximum budget (slider)
        - country: defaults to "UK" (textbox)
    
    Optional parameters (all textboxes):
        - brand_name: Audi, BMW, etc.
        - model_name: A7, X3, etc.
        - make_year: 2012, 2019, etc.
        - engine_specs: 3.0L TFSI, 2.2L TDI, etc.
        - fuel_type: petrol, diesel, electric.
        - gearbox: S Tronic, CVT, etc.
        - wheel_drive: rear wheel drive, quattro, x-drive, all wheel drive, etc.
        - car_type: saloon, SUV, coupe, etc.
        - mileage: 20000 km, 300000 miles.
        - postcode: EH4 6RJ, etc.
    """
    query = f"I'm looking to buy a {used_new_both} car in {country} within a maximum budget of {budget}."

    # Check for optional parameters and append details to the query
    if brand_name or model_name or make_year or postcode or fuel_type or engine_specs or wheel_drive or gearbox or car_type or mileage:
        query += "\nHere are the specifications I am looking at:\n"
        if brand_name:
            query += f"- {brand_name} cars.\n"
        if model_name:
            query += f"- {model_name} model.\n"
        if make_year:
            query += f"- {make_year}.\n"
        if fuel_type:
            query += f"- {fuel_type} variant.\n"
            
        query += "\n\nI'm interested in knowing:\n"
        query += "1. What are some common problems of this car?"

        if engine_specs:
            query += f"\n2. What are some common problems of the {engine_specs} engine in this car?"
        else:
            query += "\n2. What are some common problems of the different engine configurations found in this car?"
        
        query += f"""
3. Is it LEZ compliant? Is it CAZ (clean air zone) compliant? Is it ULEZ compliant?
4. The checklist of things I need to check specific to this car when I go to check it out in person.
5. How much does this car depreciate over time? Can I see a graph (with options for date range, location, etc) for detailed analysis?
6. How much are the running and ownership costs?
"""

        if gearbox:
            query += f"7. Are there any common issues I need to be worried about {gearbox} gearbox?"
        else:
            query += "7. Are there any common issues with the different gearbox configurations?"

        if wheel_drive:
            query += f"\n8. Are there any common issues I need to be worried about {wheel_drive} version?"
        else:
            query += "\n8. Are there any common issues with the different wheel drive configurations?"
        
        if car_type:
            query += f"\n9. Are there any common issues I need to be worried about {car_type} version?"
        else:
            query += "\n9. Are there any common issues with the different body types?"

        if mileage:
            query += f"\n10. Are there any common issues if this car has done {mileage}?"
        else:
            query += "\n10. Are there any common issues with high mileage?"

        query += "\n11. Does the car come with Android Auto and Apple Carplay? If not, what are the aftermarket solutions?"

        if postcode:
            query += f"\n12. Do I have any {brand_name} specialist garage near {postcode}? How much do they charge for service?"

    else:
        query += "\nGive me a list of top 10 cars that I can buy based on comparative analysis."
    
    return query
