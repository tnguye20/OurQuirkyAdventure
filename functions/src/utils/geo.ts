const geoCalculate = (coordinate: string, ref:string) => {
  let [ degrees, minutes, seconds ] = coordinate.trim().replace(/ +/g, '').split(",");
  let [ d1, d2 ] = degrees.split("/");
  let [ m1, m2 ] = minutes.split("/");
  let [ s1, s2 ] = seconds.split("/");
  let direction = ref === "N" || ref === "E" ? 1 : -1;
  let decimalValue = direction * ( Number(d1)/Number(d2) + (Number(m1)/Number(m2))/60 + (Number(s1)/Number(s2))/3600 );
  return decimalValue;
}

export {
  geoCalculate
};
