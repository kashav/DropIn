import json
from pprint import pprint

if __name__ == '__main__':
    with open('buildings.json') as f:
        buildings = json.loads(f.read())

    with open('courses.json') as f:
        courses = json.loads(f.read())

    building_codes = [b['code'] for b in buildings]

    for course in courses:
        for meeting_section in course['meeting_sections']:
            for time in meeting_section['times']:
                try:
                    index = building_codes.index(time['location'][0:2])
                except ValueError:
                    continue

                time['location'] = dict(hall=time['location'],
                                        building=buildings[index])

    print(json.dumps(courses))
