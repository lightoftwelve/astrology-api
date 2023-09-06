function getClosestAspect(angularSeparation) {
    const aspects = [
      { name: 'Conjunction', degree: 0, orb: 10 },
      { name: 'Sextile', degree: 60, orb: 6 },
      { name: 'Square', degree: 90, orb: 8 },
      { name: 'Trine', degree: 120, orb: 8 },
      { name: 'Opposition', degree: 180, orb: 10 },
    ];
  
    for (const aspect of aspects) {
      const minDegree = aspect.degree - aspect.orb;
      const maxDegree = aspect.degree + aspect.orb;
      if (angularSeparation >= minDegree && angularSeparation <= maxDegree) {
        return aspect.name;
      }
    }
  
    return null;
  }  

module.exports = {getClosestAspect};