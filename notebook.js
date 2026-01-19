function _1(md){return(
md`## Final Submission`
)}

function _2(md){return(
md`# Title : The Creator Economy Unveiled - An Interactive Visual Journey Through Global YouTube Success.`
)}

function _3(md){return(
md`## Narrative Structure
**Introduction** <br>
**Dataset** <br>
**Questions** <br>
***Question 1***: Which countries dominate the YouTube creator economy, and how is YouTube success distributed worldwide? <br>
***Question 2***:Which content categories attract the most subscribers, views, and engagement? What is trending? <br>
***Question 3***: How do earnings correlate with subscribers, views, and engagement? Who earns the most per view? <br>
***Question 4***: Do more subscribers always mean more views? Which channels have the most engaged audiences? <br>
***Question 5***: Evolution of YouTube Success (2005–2023) <br>
***Question 6***: Upload Frequency vs Success <br>`
)}

function _4(md){return(
md`## Motivation
YouTube has evolved from a simple video sharing platform into a complex global economic ecosystem where content creators build careers, brands shape marketing strategies, and audiences engage with billions of hours of content daily. Understanding the forces driving success in this creator economy matters profoundly: it reveals how cultural trends propagate across borders, how economic value flows through digital networks, and how creators from diverse backgrounds can achieve financial sustainability through content production. The platform's reach, spanning 28+ countries with millions of active channels across entertainment, education, music, gaming, and beyond offers a unique lens into global patterns of content consumption, audience engagement, and monetization. Interactive visualization serves as an essential tool for exploring these multidimensional patterns because YouTube success cannot be reduced to a single metric; subscriber counts, view engagement, earnings per view, content category dynamics, geographic distribution, and temporal evolution all interact in complex ways that static summaries cannot adequately capture. This project was inspired by the recognition that the creator economy operates simultaneously across multiple axes—popularity, profitability, efficiency, and reach—and that revealing the relationships between these dimensions requires an exploratory approach where users can investigate patterns, filter by category or country, trace temporal evolution, and discover non-obvious insights about what drives success on the world's largest video platform.`
)}

function _5(md){return(
md`## Dataset
The dataset analyzed in this project consists of 995 top-performing YouTube channels sourced from the "Global YouTube Statistics" dataset, containing comprehensive information about each channel's performance metrics and contextual attributes. Each record includes the channel name (Youtuber), subscriber count, total video views, upload count, content category, channel type, estimated monthly and yearly earnings ranges, video views and subscriber gains for the last 30 days, various ranking metrics (video views rank, country rank, channel type rank), and creation date information (year, month, date). Geographic variables include the channel's country, abbreviation, and precise latitude/longitude coordinates for spatial mapping. The dataset additionally incorporates socioeconomic context variables for each country: gross tertiary education enrollment percentage, total population, unemployment rate, and urban population figures, enabling analysis of how national development indicators correlate with creator economy participation. To ensure data quality and analytical validity, extensive preprocessing was performed: Records were filtered to retain only channels with valid names, country assignments, positive subscriber and view counts, calculable average earnings, and valid geographic coordinates, resulting in a cleaned dataset of 899 high-quality channel records suitable for multi-dimensional visual analysis. This comprehensive dataset supports the project's goals by providing the metrics necessary to analyze success across geographic, categorical, temporal, and economic dimensions while enabling fair comparisons through normalized metrics that account for population size, audience scale, and content production volume.
`
)}

function _data(FileAttachment){return(
FileAttachment("Global YouTube Statistics.csv").csv({typed: true})
)}

function _cleanedData(data){return(
data.map(d => {
  
  const cleanText = s =>
    typeof s === "string"
      ? s
          .replace(/[^\x00-\x7F]/g, "") // remove non-ASCII chars
          .replace(/\uFEFF/g, "")       // remove BOM
          .replace(/\s+/g, " ")         // normalize whitespace
          .trim()
      : s;

  const toNum = val => {
    if (val == null || val === "" || val === "N/A" || val === "NaN") return null;
    const cleaned = String(val).replace(/[^0-9.-]/g, "");
    const num = +cleaned;
    return isNaN(num) ? null : num;
  };

  
  const lowY = toNum(d.lowest_yearly_earnings);
  const highY = toNum(d.highest_yearly_earnings);
  let avgY = (lowY + highY) / 2;
  if (!avgY || avgY <= 0) avgY = null;

  
  let cat = cleanText(d.category);
  const chType = cleanText(d.channel_type);

  
  const invalidCats = [null, undefined, "", "N/A", "None", "NaN", "null", "nan"];
  if (invalidCats.includes(cat) || !cat) {
    cat = chType || "Other / Unknown";
  }

  return {
    rank: toNum(d.rank),
    youtuber: cleanText(d.Youtuber) || null,
    title: cleanText(d.Title) || null,

    category: cat,
    channel_type: chType || null,

    country: cleanText(d.Country) || null,
    abbreviation: cleanText(d.Abbreviation) || null,
    latitude: toNum(d.Latitude),
    longitude: toNum(d.Longitude),

    subscribers: toNum(d.subscribers),
    video_views: toNum(d["video views"]),
    uploads: toNum(d.uploads),

    video_views_last_30_days: toNum(d.video_views_for_the_last_30_days),
    subscribers_last_30_days: toNum(d.subscribers_for_last_30_days),

    lowest_monthly_earnings: toNum(d.lowest_monthly_earnings),
    highest_monthly_earnings: toNum(d.highest_monthly_earnings),
    lowest_yearly_earnings: lowY,
    highest_yearly_earnings: highY,
    avg_yearly_earnings: avgY,

    video_views_rank: toNum(d.video_views_rank),
    country_rank: toNum(d.country_rank),
    channel_type_rank: toNum(d.channel_type_rank),

    created_year: toNum(d.created_year),
    created_month: cleanText(d.created_month),
    created_date: toNum(d.created_date),

    gross_tertiary_enrollment: toNum(d["Gross tertiary education enrollment (%)"]),
    population: toNum(d.Population),
    unemployment_rate: toNum(d["Unemployment rate"]),
    urban_population: toNum(d.Urban_population),

    earnings_per_subscriber:
      toNum(d.subscribers) > 0 && avgY
        ? avgY / toNum(d.subscribers)
        : null,

    earnings_per_view:
      toNum(d["video views"]) > 0 && avgY
        ? avgY / toNum(d["video views"])
        : null
  };
})
.filter(
  d =>
    d.youtuber &&
    d.country &&
    d.subscribers > 0 &&
    d.video_views > 0 &&
    d.avg_yearly_earnings !== null &&
    !isNaN(d.latitude) &&
    !isNaN(d.longitude)
)
)}

function _8(md){return(
md`## Question 1:  Which countries dominate the YouTube creator economy, and how is YouTube success distributed worldwide?`
)}

function _9(md){return(
md`## YouTube Global Creator Economy Visualization

### Overview

This visualization analyzes a dataset of top YouTube channels worldwide, with each entry containing subscriber counts, video views, estimated yearly earnings, and geographic information. The data also includes socioeconomic context for each country-population, education enrollment rates, unemployment, and urbanization levels—to help explain patterns in the creator economy.

### What I'm Analyzing and Why

The goal is to understand how different countries participate in YouTube's creator economy. I aggregated individual channels by country to compute totals for subscribers, views, and earnings, which show each nation's overall presence on the platform. However, raw totals alone can be misleading when comparing countries of different sizes. A country with 10 times the population naturally has more potential creators and viewers, so I calculated normalized metrics to enable fair comparisons: earnings-per-million-subscribers reveals monetization efficiency, views-per-subscriber measures audience engagement, subscribers-per-capita shows creator penetration relative to population, and top-channel dominance indicates whether one mega-creator dominates or success is distributed more evenly. I also computed earnings efficiency (how a country's monetization compares to the global average) to identify markets that "punch above their weight" economically.

These variables provide crucial context. High tertiary enrollment might correlate with digital skills needed for content creation, while unemployment rates and urbanization affect both creator supply and audience demand. These factors help explain why certain countries succeed in specific aspects of the creator economy.

### What the Metrics Reveal

Each metric shows a different dimension. Total channels shows the size of a country's creator ecosystem. Total subscribers, views, and earnings establish absolute scale and influence. Average earnings and subscribers characterize typical creator profiles—whether an ecosystem has many mid-tier channels or is dominated by mega-creators. The normalized metrics unlock deeper insights: earnings-per-million-subscribers identifies valuable audiences and effective monetization strategies, views-per-subscriber distinguishes engaged communities from passive viewers, subscribers-per-capita reveals population-level participation patterns, top-channel dominance exposes attention inequality, and earnings efficiency highlights markets achieving disproportionate economic success. Ranking by total subscribers establishes the global hierarchy of creator markets.

### Visualization Design

The map uses two encoding layers. Countries are colored with a blue scale based on total subscribers—darker blue means larger aggregate audiences. On top of this, I placed bubbles at each country's location where both size and color represent total earnings (yellow for lower, transitioning through orange to red for highest). Using both size and color for the same variable is intentional: size allows area comparison while the warm color progression adds an intuitive "heat map" quality.

This design separates subscriber influence (map color) from economic value (bubbles), letting viewers spot interesting divergences—countries with large audiences but modest earnings, or nations achieving high monetization despite smaller subscriber bases. The geographic layout preserves spatial relationships, revealing regional patterns and cultural zones with similar creator economy profiles. Three legends guide interpretation: one for the subscriber color scale, one showing the earnings-to-size mapping, and one for the earnings color gradient. Tooltips provide exact values when hovering over countries or bubbles.

This approach reveals YouTube not just as a content platform but as a complex global economic system with distinct geographic patterns, where success can be measured through multiple lenses—audience size, engagement intensity, monetization efficiency, and market concentration.`
)}

function _tableData(countryData){return(
countryData.map(d => ({
  "Rank": d.rank,
  "Country": d.country,
  "Code": d.abbreviation,
  "Channels": d.totalChannels,
  "Subscribers": d.totalSubscribers,
  "Views": d.totalViews,
  "Earnings": d.totalEarnings,
  "Top Creator": d.topChannel,
  "Top Subs": d.topChannelSubscribers,
  "Concentration %": d.topChannelDominance,
  "$/Million Subs": d.earningsPerMillion,
  "Efficiency": d.efficiency,
  "Above Weight": d.punchAboveWeight ? "Yes" : "No",
  "Penetration %": d.subscribersPerCapita
}))
)}

function _11(Inputs,tableData,d3){return(
Inputs.table(tableData, {
  format: {
    "Subscribers": d3.format(","),
    "Views": d3.format(","),
    "Earnings": d3.format("$,"),
    "Top Subs": d3.format(","),
    "Channels": d3.format(","),
    "Concentration %": d3.format(".1f"),
    "$/Million Subs": d3.format("$,"),
    "Efficiency": d3.format(".2f"),
    "Penetration %": d3.format(".4f")
  }
})
)}

async function _globalMap(world,d3,topojson,countryData,countryNameMap)
{
  const worldData = await world;
  
  const width = 1400;
  const height = 750;
  const margin = {top: 80, right: 250, bottom: 20, left: 40};
  
  const svg = d3.create("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height])
    .attr("style", "max-width: 100%; height: auto; background: #f8f8f8;");
  
  svg.append("text")
    .attr("x", width / 2)
    .attr("y", 35)
    .attr("text-anchor", "middle")
    .attr("font-size", "24px")
    .attr("font-weight", "bold")
    .attr("font-family", "Arial, sans-serif")
    .attr("fill", "#333")
    .text("Global YouTube Creator Economy: Distribution of Success");
  
  svg.append("text")
    .attr("x", width / 2)
    .attr("y", 60)
    .attr("text-anchor", "middle")
    .attr("font-size", "14px")
    .attr("font-family", "Arial, sans-serif")
    .attr("fill", "#666")
    .text("Countries colored by total subscribers; bubble size and color represent average yearly earnings");
  
  const mapWidth = width - margin.left - margin.right - 200;
  const mapHeight = height - margin.top - margin.bottom;
  
  const projection = d3.geoNaturalEarth1()
    .fitSize([mapWidth, mapHeight], 
             topojson.feature(worldData, worldData.objects.countries));
  
  const path = d3.geoPath(projection);
  
  const countries = topojson.feature(worldData, worldData.objects.countries);
  
  const countryLookup = new Map();
  countryData.forEach(d => {
    const mappedName = countryNameMap.get(d.country) || d.country;
    countryLookup.set(mappedName, d);
  });
  
  const top5Countries = countryData.slice(0, 5);
  const top5Names = new Set(top5Countries.map(d => d.country));
  
  const subscriberColorScale = d3.scaleSequential()
    .domain([0, d3.max(countryData, d => d.totalSubscribers)])
    .interpolator(d3.interpolateRgb("#d0e5f5", "#1a5490"));
  
  const bubbleSizeScale = d3.scaleSqrt()
    .domain([0, d3.max(countryData, d => d.totalEarnings)])
    .range([2, 35]);
  
  const bubbleColorScale = d3.scaleSequential()
    .domain([0, d3.max(countryData, d => d.totalEarnings)])
    .interpolator(d3.interpolateRgb("#ffe066", "#c0504d"));
  
  const mapGroup = svg.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);
  
  const countryPaths = mapGroup.selectAll("path.country")
    .data(countries.features)
    .join("path")
    .attr("class", "country")
    .attr("d", path)
    .attr("fill", d => {
      const countryName = d.properties.name;
      const data = countryLookup.get(countryName);
      if (!data) return "#e8e8e8";
      return subscriberColorScale(data.totalSubscribers);
    })
    .attr("stroke", "#999")
    .attr("stroke-width", 0.5);
  
  const countryTooltip = svg.append("g")
    .attr("class", "country-tooltip")
    .style("display", "none")
    .style("pointer-events", "none");
  
  countryTooltip.append("rect")
    .attr("fill", "white")
    .attr("stroke", "#333")
    .attr("stroke-width", 1)
    .attr("rx", 4)
    .attr("opacity", 0.95);
  
  const countryTooltipText = countryTooltip.append("text")
    .attr("font-size", "12px")
    .attr("font-family", "Arial, sans-serif");
  
  countryTooltipText.append("tspan")
    .attr("class", "tooltip-country")
    .attr("x", 10)
    .attr("dy", "1.2em")
    .attr("font-weight", "bold");
  
  countryTooltipText.append("tspan")
    .attr("class", "tooltip-subscribers")
    .attr("x", 10)
    .attr("dy", "1.4em");
  
  countryPaths
    .on("mouseover", function(event, d) {
      const countryName = d.properties.name;
      const data = countryLookup.get(countryName);
      if (!data) return;
      
      countryTooltip.style("display", null);
      countryTooltip.select(".tooltip-country").text(`Country: ${data.country}`);
      countryTooltip.select(".tooltip-subscribers").text(`Subscribers: ${d3.format(",")(data.totalSubscribers)}`);
      
      const bbox = countryTooltipText.node().getBBox();
      countryTooltip.select("rect")
        .attr("width", bbox.width + 20)
        .attr("height", bbox.height + 10);
      
      d3.select(this).attr("stroke-width", 1.5).attr("stroke", "#000");
    })
    .on("mousemove", function(event) {
      const [x, y] = d3.pointer(event, svg.node());
      countryTooltip.attr("transform", `translate(${x + 10},${y - 40})`);
    })
    .on("mouseout", function() {
      countryTooltip.style("display", "none");
      d3.select(this).attr("stroke-width", 0.5).attr("stroke", "#999");
    });
  
  const bubbles = mapGroup.selectAll("circle.bubble")
    .data(countryData.filter(d => d.latitude && d.longitude))
    .join("circle")
    .attr("class", "bubble")
    .attr("cx", d => {
      const coords = projection([d.longitude, d.latitude]);
      return coords ? coords[0] : 0;
    })
    .attr("cy", d => {
      const coords = projection([d.longitude, d.latitude]);
      return coords ? coords[1] : 0;
    })
    .attr("r", d => bubbleSizeScale(d.totalEarnings))
    .attr("fill", d => bubbleColorScale(d.totalEarnings))
    .attr("fill-opacity", 0.7)
    .attr("stroke", "#333")
    .attr("stroke-width", 0.8);
  
  const bubbleTooltip = svg.append("g")
    .attr("class", "bubble-tooltip")
    .style("display", "none")
    .style("pointer-events", "none");
  
  bubbleTooltip.append("rect")
    .attr("fill", "white")
    .attr("stroke", "#333")
    .attr("stroke-width", 1)
    .attr("rx", 4)
    .attr("opacity", 0.95);
  
  const bubbleTooltipText = bubbleTooltip.append("text")
    .attr("font-size", "12px")
    .attr("font-family", "Arial, sans-serif");
  
  bubbleTooltipText.append("tspan")
    .attr("class", "bubble-tooltip-country")
    .attr("x", 10)
    .attr("dy", "1.2em")
    .attr("font-weight", "bold");
  
  bubbleTooltipText.append("tspan")
    .attr("class", "bubble-tooltip-earnings")
    .attr("x", 10)
    .attr("dy", "1.4em");
  
  bubbles
    .on("mouseover", function(event, d) {
      bubbleTooltip.style("display", null);
      bubbleTooltip.select(".bubble-tooltip-country").text(`Country: ${d.country}`);
      bubbleTooltip.select(".bubble-tooltip-earnings").text(`Avg Yearly Earnings: ${d3.format("$,")(d.totalEarnings)}`);
      
      const bbox = bubbleTooltipText.node().getBBox();
      bubbleTooltip.select("rect")
        .attr("width", bbox.width + 20)
        .attr("height", bbox.height + 10);
      
      d3.select(this).attr("stroke-width", 2).attr("stroke", "#000");
    })
    .on("mousemove", function(event) {
      const [x, y] = d3.pointer(event, svg.node());
      bubbleTooltip.attr("transform", `translate(${x + 10},${y - 40})`);
    })
    .on("mouseout", function() {
      bubbleTooltip.style("display", "none");
      d3.select(this).attr("stroke-width", 0.8).attr("stroke", "#333");
    });
  
  const legendX = margin.left + mapWidth + 60;
  
  const subLegendY = margin.top + 50;
  const subLegendGroup = svg.append("g")
    .attr("transform", `translate(${legendX},${subLegendY})`);
  
  subLegendGroup.append("text")
    .attr("x", 0)
    .attr("y", 0)
    .attr("font-size", "13px")
    .attr("font-weight", "bold")
    .text("Subscribers");
  
  const gradientWidth = 120;
  const gradientHeight = 15;
  
  const subGradient = svg.append("defs")
    .append("linearGradient")
    .attr("id", "subscriber-gradient-legend")
    .attr("x1", "0%")
    .attr("x2", "100%");
  
  subGradient.append("stop")
    .attr("offset", "0%")
    .attr("stop-color", "#d0e5f5");
  
  subGradient.append("stop")
    .attr("offset", "100%")
    .attr("stop-color", "#1a5490");
  
  subLegendGroup.append("rect")
    .attr("x", 0)
    .attr("y", 10)
    .attr("width", gradientWidth)
    .attr("height", gradientHeight)
    .attr("fill", "url(#subscriber-gradient-legend)");
  
  subLegendGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("font-size", "11px")
    .text("13,100,000");
  
  subLegendGroup.append("text")
    .attr("x", gradientWidth)
    .attr("y", 40)
    .attr("text-anchor", "end")
    .attr("font-size", "11px")
    .text("6B");
  
  const bubbleSizeLegendY = subLegendY + 100;
  const bubbleSizeLegendGroup = svg.append("g")
    .attr("transform", `translate(${legendX},${bubbleSizeLegendY})`);
  
  bubbleSizeLegendGroup.append("text")
    .attr("x", 0)
    .attr("y", 0)
    .attr("font-size", "13px")
    .attr("font-weight", "bold")
    .text("Avg Yearly Earnings (Bubble Size)");
  
  const minEarnings = d3.min(countryData, d => d.totalEarnings);
  const maxEarnings = d3.max(countryData, d => d.totalEarnings);
  const earningsStep = (maxEarnings - minEarnings) / 3;
  
  const legendSizes = [
    minEarnings + earningsStep * 0,
    minEarnings + earningsStep * 1,
    minEarnings + earningsStep * 2,
    maxEarnings
  ];
  
  const formatEarnings = (value) => {
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(0)}M`;
    return `$${d3.format(",")(value)}`;
  };
  
  const circleLegendGroup = bubbleSizeLegendGroup.append("g")
    .attr("transform", "translate(0, 30)");
  
  let currentY = 0;
  
  legendSizes.forEach((earnings, i) => {
    const r = bubbleSizeScale(earnings);
    const circleY = currentY + r;
    
    circleLegendGroup.append("circle")
      .attr("cx", 30)
      .attr("cy", circleY)
      .attr("r", r)
      .attr("fill", bubbleColorScale(earnings))
      .attr("fill-opacity", 0.6)
      .attr("stroke", "#333")
      .attr("stroke-width", 0.8);
    
    circleLegendGroup.append("text")
      .attr("x", 30 + r + 15)
      .attr("y", circleY + 5)
      .attr("font-size", "12px")
      .attr("fill", "#333")
      .text(formatEarnings(earnings));
    
    currentY = circleY + r + 15;
  });
  
  const colorScaleLegendY = bubbleSizeLegendY + currentY + 75;
  const colorScaleLegendGroup = svg.append("g")
    .attr("transform", `translate(${legendX},${colorScaleLegendY})`);
  
  colorScaleLegendGroup.append("text")
    .attr("x", 0)
    .attr("y", 0)
    .attr("font-size", "13px")
    .attr("font-weight", "bold")
    .text("Avg Yearly Earnings (Color Scale)");
  
  const earningsColorGradient = svg.append("defs")
    .append("linearGradient")
    .attr("id", "earnings-color-gradient-legend")
    .attr("x1", "0%")
    .attr("x2", "100%");
  
  earningsColorGradient.append("stop")
    .attr("offset", "0%")
    .attr("stop-color", "#ffe066");
  
  earningsColorGradient.append("stop")
    .attr("offset", "50%")
    .attr("stop-color", "#ff8c42");
  
  earningsColorGradient.append("stop")
    .attr("offset", "100%")
    .attr("stop-color", "#c0504d");
  
  colorScaleLegendGroup.append("rect")
    .attr("x", 0)
    .attr("y", 10)
    .attr("width", gradientWidth)
    .attr("height", gradientHeight)
    .attr("fill", "url(#earnings-color-gradient-legend)")
    .attr("stroke", "#999")
    .attr("stroke-width", 0.5);
  
  colorScaleLegendGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("font-size", "11px")
    .text("$0");
  
  colorScaleLegendGroup.append("text")
    .attr("x", gradientWidth)
    .attr("y", 40)
    .attr("text-anchor", "end")
    .attr("font-size", "11px")
    .text(formatEarnings(maxEarnings));
  
  return svg.node();
}


function _13(md){return(
md`## Question 2: Which content categories attract the most subscribers, views, and engagement? What is trending?
`
)}

function _14(md){return(
md`## YouTube Channel Analytics: Content Category Performance Analysis

### Summary

This interactive dashboard analyzes 899 top YouTube channels across three coordinated visualizations to reveal which content categories dominate in subscribers, views, and earnings. The key finding: **success is multidimensional**—high subscriber counts don't guarantee proportional earnings, and view engagement efficiency often matters more than audience size.

---

### Visualization Design

#### 1. Treemap: Top 20 Highest-Earning Channels
- **Size** = Video views (audience reach)
- **Color** = Yearly earnings (yellow $0 → red $60M+)
- **Ranking** = Sorted by earnings (who's most profitable?)

**Why This Encoding?** The color gradient immediately identifies monetization leaders, while size shows if high earnings come from massive reach or efficiency.

#### 2. Nested Pie Chart: Category Market Share
- **Inner ring** = Total subscribers per category
- **Outer ring** = Top 5 channels per category (distributed within each category's angular slice)
- **Ranking** = Sorted by subscribers (who's most popular?)

**Why This Encoding?** Radial alignment shows both market concentration (Entertainment's large blue slice) and whether dominance comes from one star (Music/T-Series) or many channels (People & Blogs fragmentation).

#### 3. Dual Bar Charts: Subscribers vs. Views
- **Aligned Y-axis** = Same category order enables direct comparison
- **Bar length** = Metric values

**Why This Encoding?** Side-by-side placement reveals engagement efficiency—Music's view bar exceeds its subscriber bar (2.5:1 ratio = high replay value), while Gaming lags (engagement challenges).

---

### Critical Design Decision: Why Different Charts Show Different "Top" Channels

**The "inconsistency" is intentional:**
- **Treemap** ranks by **earnings** → Shows monetization leaders
- **Nested pie** ranks by **subscribers** → Shows audience size leaders

#### Example: Entertainment Category
| Channel | Subscribers | Earnings | Earnings/Subscriber |
|---------|-------------|----------|---------------------|
| MrBeast | 166M | $34.4M | $0.21 |
| Zee TV | 70.5M | $43.5M | $0.62 |

**Insight**: Zee TV earns more with fewer subscribers through 3x better view-per-subscriber rates. This reveals that **popularity ≠ profitability**—content optimization beats raw follower counts.

**Why This Matters**: Channels appearing in both charts (like MrBeast) are rare multi-dimensional winners. Channels only in the pie chart need monetization optimization; channels only in the treemap have cracked efficiency.

---

### Key Findings

#### 1. Entertainment & Music Dominate Scale
Entertainment leads in subscribers (500M+), Music in view engagement (2.5:1 view-to-subscriber ratio). However, earnings leadership within Entertainment is distributed—no single formula for success.

#### 2. Education: The Hidden Monetization Giant
Cocomelon ranks #2 in earnings ($50.4M) with 162M subscribers (1,012 views/subscriber) vs. MrBeast's 166M subscribers (170 views/subscriber). **Family-friendly content drives premium ad rates**, proving advertiser demographics matter more than audience size.

#### 3. Monetization Efficiency Varies Wildly
- **High efficiency**: Zee TV ($0.62/subscriber), Sony SAB ($0.51/subscriber)
- **Low efficiency**: Kids content channels ($0.12-0.15/subscriber)

Kids content faces lower CPMs despite massive reach, while Shows/Music optimize through episodic formats and replay value.

#### 4. Gaming Faces Engagement Challenges
Gaming's view-to-subscriber ratio lags other categories, suggesting platform competition (Twitch) or audience fatigue with certain genres.

---

### Interaction: How Filtering Reveals Insights

**Click any element** → All charts filter to that category (others fade to 30% opacity)

**Example Workflow**:
1. Click "Education" → See modest subscriber count (inner pie)
2. Observe treemap → Cocomelon dominates in dark red (high earnings)
3. Check bar charts → Views exceed subscriber predictions
4. **Conclusion**: Education is view-efficient and high-earning despite smaller audiences

---

### Conclusion

YouTube success operates on **three independent axes**: audience size, engagement, and monetization. The dashboard's use of different ranking metrics (earnings vs. subscribers) exposes which channels are **popular vs. profitable**—a critical distinction for strategy.

**Actionable Insight**: Prioritize **views-per-subscriber** and **advertiser-friendly formats** over raw follower counts. Zee TV earning $43.5M with 70M subscribers outperforms many 100M+ channels, proving strategic content optimization beats viral growth alone. Entertainment and Music lead in scale, but Education and Shows demonstrate that efficiency and niche targeting can deliver comparable or superior returns.`
)}

function _categoryTable(d3,cleanedData,Inputs)
{
  const categoryStats = d3.rollups(
    cleanedData,
    v => ({
      count: v.length,
      avgSubscribers: d3.mean(v, d => +d.subscribers),
      avgViews: d3.mean(v, d => +d.video_views),
      avgYearlyEarnings: d3.mean(v, d => +d.avg_yearly_earnings),
      avgEarningsPerView: d3.mean(v, d => +d.earnings_per_view)
    }),
    d => d.category
  );

  const tableData = categoryStats
    .map(([category, stats]) => ({
      Category: category,
      Count: stats.count,
      "Avg Subscribers": stats.avgSubscribers?.toLocaleString() || "0",
      "Avg Views": stats.avgViews?.toLocaleString() || "0", 
      "Avg Yearly Earnings ($)": stats.avgYearlyEarnings 
        ? "$" + Math.round(stats.avgYearlyEarnings).toLocaleString()
        : "$0",
      "Avg Earnings per View ($)": stats.avgEarningsPerView
        ? "$" + stats.avgEarningsPerView.toFixed(4)
        : "$0.0000"
    }))
    .sort((a, b) => b.Count - a.Count);

  return Inputs.table(tableData);
}


function _16(d3,cleanedData)
{
  const width = 1300;
  const height = 1400;
  
  const svg = d3.create("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height])
    .style("font", "12px sans-serif")
    .style("background", "#f5f5f5");
  
  svg.append("rect")
    .attr("width", width)
    .attr("height", height)
    .attr("fill", "#f5f5f5");
  
  function getTextColor(backgroundColor) {
    const color = d3.color(backgroundColor);
    if (!color) return "#333";
    
    const r = color.r / 255;
    const g = color.g / 255;
    const b = color.b / 255;
    
    const rLinear = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
    const gLinear = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
    const bLinear = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);
    
    const luminance = 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear;
    
    return luminance > 0.5 ? "#333" : "#fff";
  }
  
  const categoryAgg = d3.rollups(
    cleanedData,
    v => ({
      subscribers: d3.sum(v, d => d.subscribers),
      views: d3.sum(v, d => d.video_views),
      earnings: d3.mean(v, d => d.avg_yearly_earnings),
      channels: v
    }),
    d => d.category
  ).map(([category, stats]) => ({category, ...stats}))
    .sort((a, b) => d3.descending(a.subscribers, b.subscribers));
  
  const categories = categoryAgg.map(d => d.category);
  const categoryColor = d3.scaleOrdinal()
    .domain(categories)
    .range(d3.schemeTableau10);
  
  let selectedCategory = "All";
  
  svg.append("text")
    .attr("x", width / 2)
    .attr("y", 30)
    .attr("text-anchor", "middle")
    .attr("font-size", "24px")
    .attr("font-weight", "bold")
    .text("YouTube Channel Analytics Dashboard");
  
  svg.append("text")
    .attr("x", width / 2)
    .attr("y", 55)
    .attr("text-anchor", "middle")
    .attr("font-size", "14px")
    .attr("fill", "#666")
    .text("Click any chart element to filter by category");
  
  const legendY = 85;
  
  const earnLegend = svg.append("g")
    .attr("transform", `translate(50, ${legendY})`);
  
  earnLegend.append("text")
    .attr("font-weight", "bold")
    .attr("font-size", "14px")
    .text("Avg Yearly Earnings");
  
  const defs = svg.append("defs");
  const gradient = defs.append("linearGradient")
    .attr("id", "earnings-gradient")
    .attr("x1", "0%")
    .attr("x2", "100%");
  
  gradient.selectAll("stop")
    .data([
      {offset: "0%", color: "#fff7bc"},
      {offset: "33%", color: "#fec44f"},
      {offset: "66%", color: "#fdae6b"},
      {offset: "85%", color: "#f16913"},
      {offset: "100%", color: "#d94801"}
    ])
    .join("stop")
    .attr("offset", d => d.offset)
    .attr("stop-color", d => d.color);
  
  earnLegend.append("rect")
    .attr("y", 20)
    .attr("width", 250)
    .attr("height", 20)
    .style("fill", "url(#earnings-gradient)")
    .attr("stroke", "#999")
    .attr("stroke-width", 0.5);
  
  const maxEarnings = d3.max(cleanedData, d => d.avg_yearly_earnings);
  const earnScale = d3.scaleLinear()
    .domain([0, maxEarnings])
    .range([0, 250]);
  
  const earnAxis = d3.axisBottom(earnScale)
    .ticks(4)
    .tickFormat(d => "$" + d3.format(".2s")(d));
  
  earnLegend.append("g")
    .attr("transform", "translate(0, 40)")
    .call(earnAxis)
    .selectAll("text")
    .style("font-size", "10px");
  
  const catLegend = svg.append("g")
    .attr("transform", `translate(350, ${legendY})`);
  
  catLegend.append("text")
    .attr("font-weight", "bold")
    .attr("font-size", "14px")
    .text("Category Colors");
  
  const catItems = catLegend.selectAll(".cat-item")
    .data(categoryAgg)
    .join("g")
    .attr("class", "cat-item")
    .attr("transform", (d, i) => `translate(${Math.floor(i / 6) * 200}, ${(i % 6) * 22 + 25})`);
  
  catItems.append("rect")
    .attr("width", 18)
    .attr("height", 18)
    .attr("fill", d => categoryColor(d.category));
  
  catItems.append("text")
    .attr("x", 24)
    .attr("y", 14)
    .attr("font-size", "11px")
    .text(d => d.category);
  
  const tooltip = d3.select(document.body)
    .append("div")
    .style("position", "absolute")
    .style("background", "rgba(0,0,0,0.85)")
    .style("color", "white")
    .style("padding", "10px")
    .style("border-radius", "5px")
    .style("pointer-events", "none")
    .style("opacity", 0)
    .style("font-size", "12px")
    .style("z-index", "1000");
  
  function showTooltip(event, html) {
    const tooltipWidth = 250;
    const xPos = event.pageX + 10 + tooltipWidth > window.innerWidth 
      ? event.pageX - tooltipWidth - 10 
      : event.pageX + 10;
    
    tooltip.style("opacity", 1)
      .html(html)
      .style("left", xPos + "px")
      .style("top", (event.pageY - 10) + "px");
  }
  
  function updateCharts() {
    updateTreemap();
    
    svg.selectAll(".inner-arc, .outer-arc")
      .transition()
      .duration(300)
      .style("opacity", d => 
        selectedCategory === "All" || d.data.category === selectedCategory ? 1 : 0.3
      );
    
    svg.selectAll(".bar-rect")
      .transition()
      .duration(300)
      .style("opacity", d => 
        selectedCategory === "All" || d.category === selectedCategory ? 1 : 0.3
      );
    
    svg.select(".selected-text")
      .text(selectedCategory === "All" ? "All Categories (Top 20 by Earnings)" : `Selected: ${selectedCategory} (Top 20 by Earnings)`)
      .attr("fill", selectedCategory === "All" ? "#666" : categoryColor(selectedCategory));
  }
  
  svg.append("text")
    .attr("class", "selected-text")
    .attr("x", width / 2)
    .attr("y", 260)
    .attr("text-anchor", "middle")
    .attr("font-size", "16px")
    .attr("font-weight", "bold")
    .attr("fill", "#666")
    .text("All Categories (Top 20 by Earnings)");
  
  const treemapY = 290;
  const treemapWidth = 520;
  const treemapHeight = 480;
  
  svg.append("text")
    .attr("x", 50 + treemapWidth / 2)
    .attr("y", treemapY - 10)
    .attr("text-anchor", "middle")
    .attr("font-size", "16px")
    .attr("font-weight", "bold")
    .text("Treemap: Top 20 Channels (Size = Views, Color = Earnings)");
  
  const treemapG = svg.append("g")
    .attr("class", "treemap-container")
    .attr("transform", `translate(50, ${treemapY + 10})`);
  
  function updateTreemap() {
    let channelsToShow;
    if (selectedCategory === "All") {
      channelsToShow = [...cleanedData]
        .sort((a, b) => d3.descending(a.avg_yearly_earnings, b.avg_yearly_earnings))
        .slice(0, 20);
    } else {
      const categoryData = categoryAgg.find(c => c.category === selectedCategory);
      channelsToShow = [...categoryData.channels]
        .sort((a, b) => d3.descending(a.avg_yearly_earnings, b.avg_yearly_earnings))
        .slice(0, 20);
    }
    
    const currentMaxEarnings = d3.max(channelsToShow, d => d.avg_yearly_earnings);
    const currentMinEarnings = d3.min(channelsToShow, d => d.avg_yearly_earnings);
    const earningsColor = d3.scaleSequential()
      .domain([currentMinEarnings, currentMaxEarnings])
      .interpolator(d3.interpolateYlOrRd);
    
    const hierarchyData = {
      name: "root",
      children: channelsToShow.map(ch => ({
        name: ch.youtuber,
        value: ch.video_views,
        earnings: ch.avg_yearly_earnings,
        subscribers: ch.subscribers,
        category: ch.category
      }))
    };
    
    const root = d3.hierarchy(hierarchyData)
      .sum(d => d.value)
      .sort((a, b) => b.value - a.value);
    
    d3.treemap()
      .size([treemapWidth, treemapHeight])
      .padding(2)
      .round(true)
      (root);
    
    const leaves = treemapG.selectAll("g.treemap-cell")
      .data(root.leaves(), d => d.data.name);
    
    leaves.exit()
      .transition()
      .duration(300)
      .style("opacity", 0)
      .remove();
    
    const leavesEnter = leaves.enter()
      .append("g")
      .attr("class", "treemap-cell")
      .style("opacity", 0);
    
    leavesEnter.append("rect")
      .attr("class", "treemap-rect");
    
    leavesEnter.append("text")
      .attr("class", "treemap-text");
    
    const leavesMerge = leavesEnter.merge(leaves);
    
    leavesMerge
      .transition()
      .duration(300)
      .attr("transform", d => `translate(${d.x0},${d.y0})`)
      .style("opacity", 1);
    
    leavesMerge.select("rect")
      .transition()
      .duration(300)
      .attr("width", d => d.x1 - d.x0)
      .attr("height", d => d.y1 - d.y0)
      .attr("fill", d => earningsColor(d.data.earnings))
      .attr("stroke", "white")
      .attr("stroke-width", 1);
    
    leavesMerge.select("rect")
      .style("cursor", "pointer")
      .on("mouseover", function(event, d) {
        d3.select(this).attr("stroke", "black").attr("stroke-width", 2);
        showTooltip(event, `
          <strong>${d.data.name}</strong><br/>
          Category: ${d.data.category}<br/>
          Views: ${d3.format(",")(d.data.value)}<br/>
          Subscribers: ${d3.format(",")(d.data.subscribers)}<br/>
          Earnings: $${d3.format(",")(Math.round(d.data.earnings))}
        `);
      })
      .on("mouseout", function() {
        d3.select(this).attr("stroke", "white").attr("stroke-width", 1);
        tooltip.style("opacity", 0);
      })
      .on("click", function(event, d) {
        selectedCategory = d.data.category;
        updateCharts();
      });
    
    leavesMerge.select("text")
      .attr("x", 3)
      .attr("y", 12)
      .attr("font-size", "10px")
      .attr("font-weight", "500")
      .style("pointer-events", "none")
      .text(d => {
        const w = d.x1 - d.x0;
        const h = d.y1 - d.y0;
        if (w > 50 && h > 25) {
          return d.data.name.length > 12 ? d.data.name.substring(0, 10) + "..." : d.data.name;
        }
        return "";
      })
      .attr("fill", function(d) {
        const bgColor = earningsColor(d.data.earnings);
        return getTextColor(bgColor);
      });
  }
  
  updateTreemap();
  
  const pieX = 620;
  const pieY = treemapY + 10;
  const pieRadius = 240;
  
  svg.append("text")
    .attr("x", pieX + pieRadius)
    .attr("y", pieY - 10)
    .attr("text-anchor", "middle")
    .attr("font-size", "16px")
    .attr("font-weight", "bold")
    .text("Sunburst: Categories & Top 5 Channels");
  
  const pieG = svg.append("g")
    .attr("transform", `translate(${pieX + pieRadius}, ${pieY + pieRadius + 20})`);
  
  const innerPie = d3.pie()
    .value(d => d.subscribers)
    .sort(null);
  
  const innerArc = d3.arc()
    .innerRadius(0)
    .outerRadius(pieRadius * 0.5);
  
  const innerPieData = innerPie(categoryAgg);
  
  pieG.selectAll(".inner-arc")
    .data(innerPieData)
    .join("path")
    .attr("class", "inner-arc")
    .attr("d", innerArc)
    .attr("fill", d => categoryColor(d.data.category))
    .attr("stroke", "white")
    .attr("stroke-width", 2)
    .style("cursor", "pointer")
    .on("mouseover", function(event, d) {
      d3.select(this).attr("stroke", "black").attr("stroke-width", 3);
      showTooltip(event, `
        <strong>${d.data.category}</strong><br/>
        Total Subscribers: ${d3.format(",")(d.data.subscribers)}<br/>
        Total Views: ${d3.format(",")(d.data.views)}<br/>
        Avg Earnings: $${d3.format(",")(Math.round(d.data.earnings))}
      `);
    })
    .on("mouseout", function() {
      d3.select(this).attr("stroke", "white").attr("stroke-width", 2);
      tooltip.style("opacity", 0);
    })
    .on("click", function(event, d) {
      selectedCategory = d.data.category;
      updateCharts();
    });
  
  const outerArc = d3.arc()
    .innerRadius(pieRadius * 0.52)
    .outerRadius(pieRadius * 0.95);
  
  categoryAgg.forEach((cat, catIdx) => {
    const topChannels = cat.channels
      .sort((a, b) => b.subscribers - a.subscribers)
      .slice(0, 5);
    
    const catPieData = innerPieData.find(d => d.data.category === cat.category);
    const startAngle = catPieData.startAngle;
    const endAngle = catPieData.endAngle;
    
    const channelPie = d3.pie()
      .value(d => d.subscribers)
      .startAngle(startAngle)
      .endAngle(endAngle)
      .sort(null);
    
    pieG.selectAll(`.outer-arc-${catIdx}`)
      .data(channelPie(topChannels))
      .join("path")
      .attr("class", `outer-arc outer-arc-${catIdx}`)
      .attr("d", outerArc)
      .attr("fill", d => {
        const baseColor = d3.color(categoryColor(cat.category));
        baseColor.opacity = 0.7;
        return baseColor;
      })
      .attr("stroke", "white")
      .attr("stroke-width", 1)
      .style("cursor", "pointer")
      .on("mouseover", function(event, d) {
        d3.select(this).attr("stroke", "black").attr("stroke-width", 2);
        showTooltip(event, `
          <strong>${d.data.youtuber}</strong><br/>
          Category: ${cat.category}<br/>
          Subscribers: ${d3.format(",")(d.data.subscribers)}<br/>
          Views: ${d3.format(",")(d.data.video_views)}<br/>
          Earnings: $${d3.format(",")(Math.round(d.data.avg_yearly_earnings))}
        `);
      })
      .on("mouseout", function() {
        d3.select(this).attr("stroke", "white").attr("stroke-width", 1);
        tooltip.style("opacity", 0);
      })
      .on("click", function(event, d) {
        selectedCategory = cat.category;
        updateCharts();
      });
  });
  
  pieG.append("circle")
    .attr("r", 35)
    .attr("fill", "white")
    .attr("stroke", "#333")
    .attr("stroke-width", 2)
    .style("cursor", "pointer")
    .on("click", function() {
      selectedCategory = "All";
      updateCharts();
    });
  
  pieG.append("text")
    .attr("text-anchor", "middle")
    .attr("dy", "0.35em")
    .attr("font-size", "12px")
    .attr("font-weight", "bold")
    .text("RESET")
    .style("pointer-events", "none");
  
  const barY = treemapY + treemapHeight + 120;
  const barWidth = 520;
  const barHeight = 450;
  const barMargin = {top: 50, right: 20, bottom: 80, left: 150};
  
  const sortedData = [...categoryAgg].sort((a, b) => d3.descending(a.subscribers, b.subscribers));
  
  svg.append("text")
    .attr("x", 50 + barWidth / 2)
    .attr("y", barY)
    .attr("text-anchor", "middle")
    .attr("font-size", "16px")
    .attr("font-weight", "bold")
    .text("Total Subscribers by Category");
  
  const xSubs = d3.scaleLinear()
    .domain([0, d3.max(sortedData, d => d.subscribers)])
    .range([barMargin.left, barWidth - barMargin.right]);
  
  const ySubs = d3.scaleBand()
    .domain(sortedData.map(d => d.category))
    .range([barY + barMargin.top, barY + barHeight - barMargin.bottom])
    .padding(0.2);
  
  svg.append("g")
    .selectAll("rect")
    .data(sortedData)
    .join("rect")
    .attr("class", "bar-rect")
    .attr("x", barMargin.left + 50)
    .attr("y", d => ySubs(d.category))
    .attr("width", d => xSubs(d.subscribers) - barMargin.left)
    .attr("height", ySubs.bandwidth())
    .attr("fill", d => categoryColor(d.category))
    .style("cursor", "pointer")
    .on("mouseover", function(event, d) {
      d3.select(this).attr("stroke", "black").attr("stroke-width", 2);
      showTooltip(event, `
        <strong>${d.category}</strong><br/>
        Subscribers: ${d3.format(",")(d.subscribers)}<br/>
        Views: ${d3.format(",")(d.views)}<br/>
        Avg Earnings: $${d3.format(",")(Math.round(d.earnings))}
      `);
    })
    .on("mouseout", function() {
      d3.select(this).attr("stroke", "none");
      tooltip.style("opacity", 0);
    })
    .on("click", function(event, d) {
      selectedCategory = d.category;
      updateCharts();
    });
  
  svg.append("g")
    .attr("transform", `translate(${barMargin.left + 50},0)`)
    .call(d3.axisLeft(ySubs))
    .selectAll("text")
    .style("font-size", "11px");
  
  svg.append("g")
    .attr("transform", `translate(50, ${barY + barHeight - barMargin.bottom})`)
    .call(d3.axisBottom(xSubs).ticks(5).tickFormat(d => d3.format(".2s")(d)));
  
  const barXOffset = 620;
  
  svg.append("text")
    .attr("x", barXOffset + barWidth / 2)
    .attr("y", barY)
    .attr("text-anchor", "middle")
    .attr("font-size", "16px")
    .attr("font-weight", "bold")
    .text("Total Views by Category");
  
  const xViews = d3.scaleLinear()
    .domain([0, d3.max(sortedData, d => d.views)])
    .range([barMargin.left, barWidth - barMargin.right]);
  
  const yViews = d3.scaleBand()
    .domain(sortedData.map(d => d.category))
    .range([barY + barMargin.top, barY + barHeight - barMargin.bottom])
    .padding(0.2);
  
  svg.append("g")
    .selectAll("rect")
    .data(sortedData)
    .join("rect")
    .attr("class", "bar-rect")
    .attr("x", barMargin.left + barXOffset)
    .attr("y", d => yViews(d.category))
    .attr("width", d => xViews(d.views) - barMargin.left)
    .attr("height", yViews.bandwidth())
    .attr("fill", d => categoryColor(d.category))
    .style("cursor", "pointer")
    .on("mouseover", function(event, d) {
      d3.select(this).attr("stroke", "black").attr("stroke-width", 2);
      showTooltip(event, `
        <strong>${d.category}</strong><br/>
        Views: ${d3.format(",")(d.views)}<br/>
        Subscribers: ${d3.format(",")(d.subscribers)}<br/>
        Avg Earnings: $${d3.format(",")(Math.round(d.earnings))}
      `);
    })
    .on("mouseout", function() {
      d3.select(this).attr("stroke", "none");
      tooltip.style("opacity", 0);
    })
    .on("click", function(event, d) {
      selectedCategory = d.category;
      updateCharts();
    });
  
  svg.append("g")
    .attr("transform", `translate(${barMargin.left + barXOffset},0)`)
    .call(d3.axisLeft(yViews))
    .selectAll("text")
    .style("font-size", "11px");
  
  svg.append("g")
    .attr("transform", `translate(${barXOffset}, ${barY + barHeight - barMargin.bottom})`)
    .call(d3.axisBottom(xViews).ticks(5).tickFormat(d => d3.format(".2s")(d)));
  
  return svg.node();
}


function _17(md){return(
md`## Question 3 : How do earnings correlate with subscribers, views, and engagement?  Who earns the most per view?


`
)}

function _18(md){return(
md`
### Overview  
This dashboard explores how YouTube channels earn money across three major drivers of success:

1. **Scale** — subscriber count  
2. **Reach** — total video views  
3. **Engagement quality** — how many views each subscriber generates  
4. **Monetization efficiency** — earnings per view (EPV)

By providing four coordinated visualizations, this dashboard reveals why some channels with fewer subscribers can outperform massive creators, and how category-level differences drive monetization outcomes.

---

## Visualization Design  

### **1. Earnings vs Subscribers (Category Averages)**  
**X-axis:** Average subscribers per category (log scale)  
**Y-axis:** Average yearly earnings (log scale)  
**Bubble size:** Earnings per View (EPV)  
**Bubble color:** Category  

#### **Why this encoding?**  
Using log–log scales makes comparisons across categories possible despite large differences in size.  
Bubble size introduces a *third dimension*—monetization efficiency—showing which categories earn the most **per view**.

#### **What it reveals:**  
- Entertainment & Music dominate in scale (high subscribers).  
- Family & Kids channels show unexpectedly high earnings relative to subscriber size.  
- Education, Kids, and some niche categories earn more per view (large bubbles).  
- Categories with many channels tend to cluster, while niche categories stand out.

#### **Key Insight:**  
**Scale drives earnings**, but EPV varies significantly—some categories earn much more from the same audience size because of higher replay value or more valuable ad demographics.

---

### **2. Earnings vs Views (Individual Channels)**  
**X-axis:** Total views (log scale)  
**Y-axis:** Yearly earnings (log scale)  
**Color:** Category  
**Filter:** Choose any category individually  

#### **Why this encoding?**  
Views are the primary driver of YouTube income, so a log–log scatter shows the fundamental “views → earnings” curve. Filtering helps compare how categories monetize per view.

#### **What it reveals:**  
- A strong upward relationship: more views → higher earnings.  
- Some categories consistently sit **above the main trend**, meaning:
  - Higher CPMs  
  - More advertiser-friendly content  
  - More monetizable audiences  
- Others sit below the trend, meaning lower per-view earnings.

#### **Key Insight:**  
Channels with similar view counts can differ **5× in yearly earnings**, depending on category CPM, content type, and audience demographics.

---

### **3. Earnings vs Engagement Rate (Views per Subscriber)**  
**X-axis:** Engagement rate (views per subscriber, %)  
**Y-axis:** Yearly earnings (log scale)  
**Color:** Category  
**Filter:** Compare categories individually  

#### **Why this encoding?**  
Engagement rate shows **loyalty** — how much each subscriber actually watches.  
This chart examines whether a highly engaged audience translates into higher earnings.

#### **What it reveals:**  
- Engagement is *less strongly correlated* with earnings than total views.  
- Some channels have very loyal audiences (high engagement %), but still earn modestly because:
  - Their total subscriber base is smaller  
  - Their CPM (earnings per 1000 views) is low  
- However, certain categories (Kids, Education, Shows) combine:
  - high engagement  
  - stable, advertiser-friendly content  
  - strong earnings  

#### **Key Insight:**  
A loyal audience is valuable, but **engagement alone does not guarantee high earnings**—total views and CPM matter more.

---

### **4. Top 25 Channels by Earnings per View (EPV)**  
**Metric:** Yearly earnings ÷ total views  
**Bars:** Sorted from highest EPV downward  
**Color:** Channel’s category  

#### **Why this encoding?**  
EPV reveals **pure monetization efficiency** — which channels earn the *most money per view*, regardless of audience size.

This removes scale from the equation and spotlights the channels and topics with the most valuable impressions.

#### **What it shows:**  
- EPV leaders are often:
  - educational  
  - technical  
  - finance-oriented  
  - niche interest creators  
- Kids channels dominate the very top because:
  - repeat viewing is extremely high  
  - advertisers pay premium CPM for brand-safe children’s content  
- Large entertainment creators appear further down because of lower per-view CPM.

#### **Key Insight:**  
High-EPV creators are the most efficient earners — they need fewer views to earn the same revenue as massive channels.

---

## Critical Cross-Chart Insight  

Each chart highlights a different dimension of creator success:

| Chart | Focus | Reveals |
|-------|--------|---------|
| **Earnings vs Subscribers (Categories)** | Scale | Which content types attract the biggest audiences |
| **Earnings vs Views (Channels)** | Reach | Which channels convert views into revenue efficiently |
| **Earnings vs Engagement Rate** | Loyalty | Whether repeat watching predicts higher earnings |
| **Top 25 EPV** | Monetization Efficiency | Who earns the *most* per view |

This design clearly separates **popularity**, **reach**, **loyalty**, and **monetization**—four metrics that are often incorrectly assumed to be the same.

---

## Key Findings  

### **1. Scale Predicts Earnings—but Not Perfectly**  
Categories like Entertainment and Music earn the most overall because of massive subscriber bases.  
But their EPV is not necessarily the highest.

### **2. Views Matter More Than Engagement**  
Engagement helps, but total view count remains the strongest predictor of earnings across all creators.

### **3. Monetization Efficiency Varies 10×–20× Across Categories**  
Kids, Education, and niche “high-intent” channels earn dramatically more *per view* than gaming or general entertainment.

### **4. The Most Efficient Earnings Don’t Come from the Biggest Creators**  
EPV leaders often have modest audiences but extremely valuable viewers or advertiser segments.

---

## Conclusion  
This dashboard shows that YouTube success is multidimensional:

- **Subscriber count** → gives scale  
- **Total views** → drives revenue  
- **Engagement** → improves retention and repeat watching  
- **Earnings per view (EPV)** → reveals monetization quality  

Together, these charts uncover why some creators with moderate audiences outperform giant creators in yearly earnings, and how category-level economics shape the entire platform.

To maximize revenue, creators should focus not only on growth, but on creating content that is advertiser-friendly, rewatchable, and tailored to high-value audiences.
`
)}

function _question_3_complete_dashboard(d3,cleanedData)
{
 
  let activeChartId = "subscribers";

  const chartOptions = [
    { id: "subscribers", label: "Earnings vs. Subscribers (Category Avg.)" },
    { id: "views",       label: "Earnings vs. Views (Individual Channels)" },
    { id: "engagement",  label: "Earnings vs. Engagement Rate" },
    { id: "topearners",  label: "Top Earners Per View (EPV)" }
  ];

  const dashboardWidth = 1400;
  const font = "Inter, sans-serif";
  const axisColor = "#333";
  const labelColor = "#374151";
  const backgroundColor = "#fcfcfc";
  const gridColor = "#eaeaea";

  const customSpectral = [
    "#9e0142", "#d53e4f", "#f46d43", "#fdae61",
    "#fee08b",
    "#a6d96a", "#66c2a5", "#3288bd", "#5e4fa2",
    "#7c0060",
    "#006837"
  ];
  const palette = [...customSpectral, ...d3.schemeSet3];

  // simple helper for numeric cleaning
  const clean = v => {
    if (v === undefined || v === null) return 0;
    if (typeof v === "number") return v;
    return +String(v).replace(/,/g, "");
  };

  // category averages for chart 1
  const categoryMap = d3.group(cleanedData, d => d.category);
  const cat_summary = Array.from(categoryMap, ([category, channels]) => {
    const validChannels = channels.map(d => ({
      ...d,
      avg_yearly_earnings: clean(d.avg_yearly_earnings),
      subscribers: clean(d.subscribers),
      video_views: clean(d.video_views),
      earnings_per_view: clean(d.earnings_per_view)
    })).filter(d =>
      d.avg_yearly_earnings > 0 &&
      d.subscribers > 0 &&
      d.video_views > 0 &&
      category !== "TED"
    );

    if (validChannels.length === 0) return null;

    return {
      category,
      subscribers: d3.mean(validChannels, d => d.subscribers),
      earnings:    d3.mean(validChannels, d => d.avg_yearly_earnings),
      views:       d3.mean(validChannels, d => d.video_views),
      epv:         d3.mean(validChannels, d => d.earnings_per_view),
      engagement:  d3.mean(validChannels, d => (d.video_views / d.subscribers) * 100),
      count:       validChannels.length
    };
  }).filter(d => d !== null && d.count >= 5);

  // top EPV channels for chart 4
  const top_epv = cleanedData
    .map(d => ({
      ...d,
      avg_yearly_earnings: clean(d.avg_yearly_earnings),
      subscribers: clean(d.subscribers),
      video_views: clean(d.video_views),
      earnings_per_view: clean(d.earnings_per_view)
    }))
    .filter(d =>
      d.earnings_per_view > 0 &&
      d.category !== "TED" &&
      d.video_views > 1_000_000 &&
      d.avg_yearly_earnings > 0
    )
    .sort((a, b) => d3.descending(a.earnings_per_view, b.earnings_per_view))
    .slice(0, 25)
    .map(d => ({
      youtuber: d.youtuber,
      category: d.category,
      earnings_per_view: d.earnings_per_view,
      avg_yearly_earnings: d.avg_yearly_earnings,
      subscribers: d.subscribers,
      views: d.video_views
    }));

  // per-channel data for charts 2 & 3
  const correlation_data = cleanedData
    .map(d => ({
      ...d,
      avg_yearly_earnings: clean(d.avg_yearly_earnings),
      subscribers: clean(d.subscribers),
      video_views: clean(d.video_views),
      earnings_per_view: clean(d.earnings_per_view)
    }))
    .filter(d =>
      d.avg_yearly_earnings > 0 &&
      d.subscribers > 100_000 &&
      d.video_views > 1_000_000 &&
      d.category !== "TED" &&
      d.earnings_per_view > 0
    )
    .filter((d, i) => i % 5 === 0)
    .map(d => ({
      youtuber: d.youtuber,
      category: d.category,
      subscribers: d.subscribers,
      earnings: d.avg_yearly_earnings,
      views: d.video_views,
      epv: d.earnings_per_view,
      engagement: (d.video_views / d.subscribers) * 100
    }));

  const categories = Array.from(new Set(cleanedData.map(d => d.category))).filter(c => c !== "TED");
  const color = d3.scaleOrdinal().domain(categories).range(palette);

  // main container
  const container = d3.create("div")
    .style("font-family", font)
    .style("background", "#f5f5f5")
    .style("padding", "0")
    .style("margin", "0")
    .style("position", "relative");

  // header with centered title & subtitle
  const header = container.append("div")
    .attr("id", "dashboard-header")
    .style("width", "100%")
    .style("background", backgroundColor)
    .style("padding", "0")
    .style("margin", "0")
    .style("position", "relative")
    .style("height", "130px");

  header.append("div")
    .style("position", "absolute")
    .style("left", "50%")
    .style("top", "0")
    .style("transform", "translateX(-50%)")
    .style("text-align", "center")
    .style("width", "100%")
    .style("font-size", "30px")
    .style("font-weight", "900")
    .style("color", "#222")
    .style("margin-top", "0px")
    .text(" Earnings, Scale, and Engagement in the Creator Economy");

  header.append("div")
    .style("position", "absolute")
    .style("left", "50%")
    .style("top", "50px")
    .style("transform", "translateX(-50%)")
    .style("text-align", "center")
    .style("width", "100%")
    .style("font-size", "18px")
    .style("font-weight", "500")
    .style("color", "#555")
    .text("How do earnings correlate with subscribers, views, and engagement? Who earns the most per view?");

  // main chart selector just under header
  const menuContainer = container.append("div")
    .style("margin", "0 auto")
    .style("padding-top", "20px")
    .style("padding-bottom", "10px")
    .style("text-align", "center")
    .style("background", backgroundColor);

  menuContainer.append("label")
    .attr("for", "chart-selector")
    .style("font-size", "16px")
    .style("font-weight", "600")
    .style("color", axisColor)
    .text("Select visualization:");

  const dropdown = menuContainer.append("select")
    .attr("id", "chart-selector")
    .style("padding", "8px 15px")
    .style("margin-left", "10px")
    .style("font-family", font)
    .style("font-size", "16px")
    .style("border-radius", "6px")
    .style("border", "1px solid #ccc")
    .style("cursor", "pointer")
    .on("change", function () {
      activeChartId = this.value;
      updateContentDisplay(activeChartId);
    });

  dropdown.selectAll("option")
    .data(chartOptions)
    .enter().append("option")
    .attr("value", d => d.id)
    .property("selected", d => d.id === activeChartId)
    .text(d => d.label);

  container.append("div")
    .style("max-width", dashboardWidth + "px")
    .style("margin", "0 auto")
    .style("border-bottom", "1px solid #ddd");

  const contentArea = container.append("div")
    .attr("id", "dashboard-content-area")
    .style("padding", "40px 60px 0px 60px")
    .style("background", "#f5f5f5")
    .style("min-height", "800px");

  // shared tooltip
  const tooltip = container.append("div")
    .style("position", "absolute")
    .style("background", "rgba(20,20,20,0.95)")
    .style("color", "#fff")
    .style("padding", "12px 16px")
    .style("border-radius", "8px")
    .style("font-size", "13px")
    .style("font-family", font)
    .style("line-height", "1.5")
    .style("opacity", 0)
    .style("pointer-events", "none")
    .style("box-shadow", "0 4px 12px rgba(0,0,0,0.4)")
    .style("z-index", "10000");

  // helper to render each chart container
  const renderChartContainer = id => {
    return contentArea.append("div")
      .attr("id", `chart-${id}`)
      .style("display", activeChartId === id ? "block" : "none")
      .style("background", backgroundColor)
      .style("border-radius", "12px")
      .style("padding", "30px")
      .style("box-shadow", "0 8px 20px rgba(0,0,0,0.08)")
      .style("margin", "0 auto")
      .style("max-width", "1200px");
  };

  const updateContentDisplay = newId => {
    chartOptions.forEach(opt => {
      d3.select(`#chart-${opt.id}`)
        .style("display", opt.id === newId ? "block" : "none");
    });
  };

  // simple legend at bottom
  function createLegend(container, categories, colorScale) {
    const legendWrapper = container.append("div")
      .style("margin", "0 auto")
      .style("max-width", "1200px")
      .style("padding", "30px 60px 40px 60px")
      .style("background", "#f5f5f5");

    legendWrapper.append("h2")
      .style("font-size", "20px")
      .style("font-weight", "800")
      .style("margin-bottom", "16px")
      .style("color", axisColor)
      .text("Category legend");

    const legend = legendWrapper.append("div")
      .style("display", "grid")
      .style("grid-template-columns", "repeat(auto-fit, minmax(200px, 1fr))")
      .style("gap", "10px 15px");

    categories.forEach(cat => {
      const item = legend.append("div")
        .style("display", "flex")
        .style("align-items", "center")
        .style("padding", "4px 8px")
        .style("border-radius", "6px")
        .style("cursor", "pointer")
        .on("mouseenter", function () { d3.select(this).style("background", "#f0f0f0"); })
        .on("mouseleave", function () { d3.select(this).style("background", "transparent"); });

      item.append("div")
        .style("width", "14px")
        .style("height", "14px")
        .style("border-radius", "50%")
        .style("background", colorScale(cat))
        .style("border", `2px solid ${d3.color(colorScale(cat)).darker(0.5)}`)
        .style("flex-shrink", "0");

      item.append("span")
        .style("margin-left", "10px")
        .style("font-size", "13px")
        .style("color", "#444")
        .text(cat);
    });
  }

  // ----------------- CHART 1: Earnings vs Subscribers (category avg) -----------------
  const margin1 = { top: 80, right: 60, bottom: 160, left: 100 };
  const width1 = 1200;
  const height1 = 800;

  const chartContainer1 = renderChartContainer("subscribers");

  const svg1 = chartContainer1.append("svg")
    .attr("viewBox", [0, 0, width1, height1])
    .style("font-family", font);

  svg1.append("text")
    .attr("x", width1 / 2)
    .attr("y", 40)
    .attr("text-anchor", "middle")
    .attr("font-size", 24)
    .attr("font-weight", 800)
    .attr("fill", axisColor)
    .text("Earnings vs Subscribers (Category Averages)");

  svg1.append("text")
    .attr("x", width1 / 2)
    .attr("y", 70)
    .attr("text-anchor", "middle")
    .attr("font-size", 14)
    .style("fill", labelColor)
    .text("Each bubble is a content category; size encodes Earnings per View (EPV).");

  const x1 = d3.scaleLog()
    .domain([
      d3.min(cat_summary, d => d.subscribers) * 0.7,
      d3.max(cat_summary, d => d.subscribers) * 1.3
    ])
    .range([margin1.left, width1 - margin1.right])
    .clamp(true);

  const y1 = d3.scaleLog()
    .domain([
      d3.min(cat_summary, d => d.earnings) * 0.7,
      d3.max(cat_summary, d => d.earnings) * 1.3
    ])
    .range([height1 - margin1.bottom, margin1.top])
    .clamp(true);

  const r1 = d3.scaleSqrt()
    .domain(d3.extent(cat_summary, d => d.epv))
    .range([20, 65]);

  svg1.append("g")
    .attr("transform", `translate(${margin1.left},0)`)
    .call(
      d3.axisLeft(y1)
        .ticks(8)
        .tickSize(-(width1 - margin1.left - margin1.right))
        .tickFormat("")
    )
    .call(g => g.selectAll(".tick line")
      .attr("stroke", gridColor)
      .attr("stroke-dasharray", "4,3")
      .attr("stroke-opacity", 0.8))
    .call(g => g.select(".domain").remove());

  svg1.append("g")
    .attr("transform", `translate(0,${height1 - margin1.bottom})`)
    .call(
      d3.axisBottom(x1)
        .ticks(8)
        .tickSize(-(height1 - margin1.top - margin1.bottom))
        .tickFormat("")
    )
    .call(g => g.selectAll(".tick line")
      .attr("stroke", gridColor)
      .attr("stroke-dasharray", "4,3")
      .attr("stroke-opacity", 0.8))
    .call(g => g.select(".domain").remove());

  svg1.append("g")
    .attr("transform", `translate(0,${height1 - margin1.bottom})`)
    .call(d3.axisBottom(x1).ticks(8).tickFormat(d => d3.format(".2s")(d)))
    .call(g => g.selectAll("line").remove())
    .call(g => g.selectAll("text").style("font-size", "12px"));

  svg1.append("g")
    .attr("transform", `translate(${margin1.left},0)`)
    .call(d3.axisLeft(y1).ticks(8).tickFormat(d => "$" + d3.format(".2s")(d)))
    .call(g => g.selectAll("line").remove())
    .call(g => g.selectAll("text").style("font-size", "12px"));

  svg1.append("text")
    .attr("x", width1 / 2)
    .attr("y", height1 - margin1.bottom + 40)
    .attr("text-anchor", "middle")
    .attr("font-size", 15)
    .attr("font-weight", 600)
    .attr("fill", axisColor)
    .text("Average subscribers →");

  svg1.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -height1 / 2)
    .attr("y", 30)
    .attr("text-anchor", "middle")
    .attr("font-size", 15)
    .attr("font-weight", 600)
    .attr("fill", axisColor)
    .text("↑ Average yearly earnings (USD)");

  const nodes1 = cat_summary.map(d => ({
    ...d,
    x: x1(d.subscribers),
    y: y1(d.earnings)
  }));

  const sim1 = d3.forceSimulation(nodes1)
    .force("x", d3.forceX(d => x1(d.subscribers)).strength(0.6))
    .force("y", d3.forceY(d => y1(d.earnings)).strength(0.6))
    .force("collide", d3.forceCollide(d => r1(d.epv) + 6))
    .stop();

  for (let i = 0; i < 280; i++) sim1.tick();

  svg1.append("g")
    .selectAll("circle")
    .data(nodes1)
    .join("circle")
    .attr("cx", d => d.x)
    .attr("cy", d => d.y)
    .attr("r", d => r1(d.epv))
    .attr("fill", d => color(d.category))
    .attr("fill-opacity", 0.88)
    .attr("stroke", d => d3.color(color(d.category)).darker(0.8))
    .attr("stroke-width", 2.5)
    .style("cursor", "pointer")
    .on("mouseenter", (event, d) => {
      d3.select(event.currentTarget)
        .transition().duration(150)
        .attr("stroke", "#fff")
        .attr("stroke-width", 4)
        .attr("fill-opacity", 1);

      tooltip.style("opacity", 1).html(`
        <strong style="font-size: 15px;">${d.category}</strong><br/>
        <span style="color: #888;">━━━━━━━━━━━</span><br/>
        <strong>Subscribers:</strong> ${d3.format(".2s")(d.subscribers)}<br/>
        <strong>Earnings:</strong> $${d3.format(".2s")(d.earnings)}/year<br/>
        <strong>EPV:</strong> $${d.epv.toFixed(5)}
      `);
    })
    .on("mousemove", event => {
      const rect = container.node().getBoundingClientRect();
      tooltip.style("left", (event.pageX - rect.left + 20) + "px")
             .style("top", (event.pageY - rect.top - 30) + "px");
    })
    .on("mouseleave", event => {
      d3.select(event.currentTarget)
        .transition().duration(150)
        .attr("stroke", d3.color(color(d3.category)).darker(0.8))
        .attr("stroke-width", 2.5)
        .attr("fill-opacity", 0.88);
      tooltip.style("opacity", 0);
    });

  chartContainer1.append("div")
    .style("margin", "25px 0 20px 0")
    .style("padding", "16px 20px")
    .style("background", "transparent")
    .style("border-radius", "8px")
    .style("font-size", "14px")
    .style("color", "#444")
    .style("line-height", "1.6")
    .html(`
      <strong>Key insight:</strong>
      Subscriber count is strongly correlated with yearly earnings. Categories with large audiences tend
      to earn more, but their efficiency (EPV) still varies by content type.
    `);

  // ----------------- CHART 2: Earnings vs Views (per channel, dropdown) -----------------
  {
    const margin2 = { top: 10, right: 60, bottom: 80, left: 110 };
    const width2 = 1200;
    const height2 = 700;

    const chartContainer2 = renderChartContainer("views");

    const headerRow2 = chartContainer2.append("div")
      .style("display", "flex")
      .style("align-items", "flex-end")
      .style("justify-content", "space-between")
      .style("margin-bottom", "10px");

    const titleBlock2 = headerRow2.append("div")
      .style("text-align", "left");

    titleBlock2.append("h2")
      .style("margin", "0")
      .style("font-size", "22px")
      .style("font-weight", "800")
      .style("color", axisColor)
      .text("Earnings vs Views (Individual Channels)");

    titleBlock2.append("p")
      .style("margin", "4px 0 0 0")
      .style("font-size", "13px")
      .style("color", labelColor)
      .text("Log–log view of how total video views relate to yearly earnings, with a category filter.");

    const controlBlock2 = headerRow2.append("div")
      .style("display", "flex")
      .style("align-items", "center")
      .style("gap", "8px");

    controlBlock2.append("span")
      .style("font-size", "13px")
      .style("color", labelColor)
      .style("font-weight", "600")
      .text("Filter by category:");

    const select2 = controlBlock2.append("select")
      .style("padding", "6px 10px")
      .style("font-family", font)
      .style("font-size", "13px")
      .style("border-radius", "6px")
      .style("border", "1px solid #ccc")
      .style("cursor", "pointer");

    const allData2 = correlation_data.filter(d => d.views > 0 && d.earnings > 0);
    const dropdownCats2 = ["All categories", ...Array.from(new Set(allData2.map(d => d.category))).sort()];

    select2.selectAll("option")
      .data(dropdownCats2)
      .enter()
      .append("option")
      .attr("value", d => d)
      .text(d => d);

    const svg2 = chartContainer2.append("svg")
      .attr("viewBox", [0, 0, width2, height2])
      .style("font-family", font);

    const x2 = d3.scaleLog()
      .range([margin2.left, width2 - margin2.right])
      .clamp(true);

    const y2 = d3.scaleLog()
      .range([height2 - margin2.bottom, margin2.top])
      .clamp(true);

    const gridY2 = svg2.append("g").attr("class", "grid-y2");
    const gridX2 = svg2.append("g").attr("class", "grid-x2");
    const axisY2 = svg2.append("g").attr("class", "axis-y2")
      .attr("transform", `translate(${margin2.left},0)`);
    const axisX2 = svg2.append("g").attr("class", "axis-x2")
      .attr("transform", `translate(0,${height2 - margin2.bottom})`);

    svg2.append("text")
      .attr("x", width2 / 2)
      .attr("y", height2 - margin2.bottom + 40)
      .attr("text-anchor", "middle")
      .attr("font-size", 14)
      .attr("font-weight", 600)
      .attr("fill", axisColor)
      .text("Total Video Views (log scale) →");

    svg2.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -height2 / 2)
      .attr("y", 32)
      .attr("text-anchor", "middle")
      .attr("font-size", 14)
      .attr("font-weight", 600)
      .attr("fill", axisColor)
      .text("↑ Average Yearly Earnings (USD, log scale)");

    const pointsGroup2 = svg2.append("g").attr("class", "points2");

    function updateViewsChart(selectedCat) {
      let data = allData2;
      if (selectedCat && selectedCat !== "All categories") {
        data = data.filter(d => d.category === selectedCat);
      }
      if (!data.length) return;

      // domain covers all points so none go outside
      const vExtent = d3.extent(data, d => d.views);
      const eExtent = d3.extent(data, d => d.earnings);

      const vMin = Math.max(1, vExtent[0]);
      const vMax = vExtent[1] * 1.05;
      const eMin = Math.max(1, eExtent[0]);
      const eMax = eExtent[1] * 1.05;

      x2.domain([vMin, vMax]);
      y2.domain([eMin, eMax]);

      gridY2
        .attr("transform", `translate(${margin2.left},0)`)
        .call(
          d3.axisLeft(y2)
            .ticks(6, "~s")
            .tickSize(-(width2 - margin2.left - margin2.right))
            .tickFormat("")
        )
        .call(g => g.selectAll(".tick line")
          .attr("stroke", gridColor)
          .attr("stroke-dasharray", "4,3")
          .attr("stroke-opacity", 0.7))
        .call(g => g.select(".domain").remove());

      gridX2
        .attr("transform", `translate(0,${height2 - margin2.bottom})`)
        .call(
          d3.axisBottom(x2)
            .ticks(6, "~s")
            .tickSize(-(height2 - margin2.top - margin2.bottom))
            .tickFormat("")
        )
        .call(g => g.selectAll(".tick line")
          .attr("stroke", gridColor)
          .attr("stroke-dasharray", "4,3")
          .attr("stroke-opacity", 0.7))
        .call(g => g.select(".domain").remove());

      axisY2
        .call(
          d3.axisLeft(y2)
            .ticks(6, "~s")
            .tickFormat(d => "$" + d3.format(".2s")(d))
        )
        .call(g => g.selectAll("line").remove())
        .call(g => g.selectAll("text").style("font-size", "11px"));

      axisX2
        .call(
          d3.axisBottom(x2)
            .ticks(6, "~s")
            .tickFormat(d => d3.format(".2s")(d))
        )
        .call(g => g.selectAll("line").remove())
        .call(g => g.selectAll("text").style("font-size", "11px"));

      const dots = pointsGroup2.selectAll("circle")
        .data(data, d => d.youtuber);

      dots.enter()
        .append("circle")
        .attr("r", 0)
        .attr("fill", d => color(d.category))
        .attr("fill-opacity", 0.65)
        .attr("stroke", d => d3.color(color(d.category)).darker(0.5))
        .attr("stroke-width", 1)
        .style("cursor", "pointer")
        .merge(dots)
        .transition()
        .duration(400)
        .attr("cx", d => x2(d.views))
        .attr("cy", d => y2(d.earnings))
        .attr("r", 4.5);

      dots.exit().transition().duration(300).attr("r", 0).remove();

      pointsGroup2.selectAll("circle")
        .on("mouseenter", (event, d) => {
          d3.select(event.currentTarget)
            .transition().duration(120)
            .attr("r", 8)
            .attr("stroke", "#fff")
            .attr("stroke-width", 2.5)
            .attr("fill-opacity", 1);

          tooltip.style("opacity", 1).html(`
            <strong>${d.youtuber}</strong><br/>
            <span style="color:#aaa;">${d.category}</span><br/>
            <span style="color:#888;">━━━━━━━━━━━</span><br/>
            <strong>Views:</strong> ${d3.format(",")(d.views)}<br/>
            <strong>Earnings:</strong> $${d3.format(".2s")(d.earnings)}/year<br/>
            <strong>EPV:</strong> $${d.epv.toFixed(5)}
          `);
        })
        .on("mousemove", event => {
          const rect = container.node().getBoundingClientRect();
          tooltip
            .style("left", (event.pageX - rect.left + 20) + "px")
            .style("top", (event.pageY - rect.top - 30) + "px");
        })
        .on("mouseleave", event => {
          d3.select(event.currentTarget)
            .transition().duration(120)
            .attr("r", 4.5)
            .attr("stroke", d3.color(color(d3.category)).darker(0.5))
            .attr("stroke-width", 1)
            .attr("fill-opacity", 0.65);
          tooltip.style("opacity", 0);
        });
    }

    updateViewsChart("All categories");

    select2.on("change", function () {
      updateViewsChart(this.value);
    });

    chartContainer2.append("div")
      .style("margin", "20px 0 10px 0")
      .style("font-size", "13px")
      .style("color", "#444")
      .style("line-height", "1.6")
      .html(`
        <strong>Key Insight:</strong>
        Across categories, earnings rise with total views, but some genres sit above the main pattern,
        signalling higher monetization per view. Use the filter to compare categories.
      `);
  }

  // ----------------- CHART 3: Earnings vs Engagement Rate -----------------
  {
    const margin3 = { top: 10, right: 60, bottom: 80, left: 110 };
    const width3 = 1200;
    const height3 = 700;

    const chartContainer3 = renderChartContainer("engagement");

    const headerRow3 = chartContainer3.append("div")
      .style("display", "flex")
      .style("align-items", "flex-end")
      .style("justify-content", "space-between")
      .style("margin-bottom", "10px");

    const titleBlock3 = headerRow3.append("div")
      .style("text-align", "left");

    titleBlock3.append("h2")
      .style("margin", "0")
      .style("font-size", "22px")
      .style("font-weight", "800")
      .style("color", axisColor)
      .text("Earnings vs Engagement Rate (Views per Subscriber)");

    titleBlock3.append("p")
      .style("margin", "4px 0 0 0")
      .style("font-size", "13px")
      .style("color", labelColor)
      .text("Does a more engaged audience (more views per subscriber) lead to higher earnings?");

    const controlBlock3 = headerRow3.append("div")
      .style("display", "flex")
      .style("align-items", "center")
      .style("gap", "8px");

    controlBlock3.append("span")
      .style("font-size", "13px")
      .style("color", labelColor)
      .style("font-weight", "600")
      .text("Filter by category:");

    const select3 = controlBlock3.append("select")
      .style("padding", "6px 10px")
      .style("font-family", font)
      .style("font-size", "13px")
      .style("border-radius", "6px")
      .style("border", "1px solid #ccc")
      .style("cursor", "pointer");

    const allData3 = correlation_data.filter(d => d.engagement > 0 && d.earnings > 0);
    const dropdownCats3 = ["All categories", ...Array.from(new Set(allData3.map(d => d.category))).sort()];

    select3.selectAll("option")
      .data(dropdownCats3)
      .enter()
      .append("option")
      .attr("value", d => d)
      .text(d => d);

    const svg3 = chartContainer3.append("svg")
      .attr("viewBox", [0, 0, width3, height3])
      .style("font-family", font);

    const x3 = d3.scaleLinear()
      .range([margin3.left, width3 - margin3.right])
      .clamp(true);

    const y3 = d3.scaleLog()
      .range([height3 - margin3.bottom, margin3.top])
      .clamp(true);

    const gridY3 = svg3.append("g").attr("class", "grid-y3");
    const gridX3 = svg3.append("g").attr("class", "grid-x3");
    const axisY3 = svg3.append("g").attr("class", "axis-y3")
      .attr("transform", `translate(${margin3.left},0)`);
    const axisX3 = svg3.append("g").attr("class", "axis-x3")
      .attr("transform", `translate(0,${height3 - margin3.bottom})`);

    svg3.append("text")
      .attr("x", width3 / 2)
      .attr("y", height3 - margin3.bottom + 40)
      .attr("text-anchor", "middle")
      .attr("font-size", 14)
      .attr("font-weight", 600)
      .attr("fill", axisColor)
      .text("Engagement Rate (Views per Subscriber, %) →");

    svg3.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -height3 / 2)
      .attr("y", 32)
      .attr("text-anchor", "middle")
      .attr("font-size", 14)
      .attr("font-weight", 600)
      .attr("fill", axisColor)
      .text("↑ Average Yearly Earnings (USD, log scale)");

    const pointsGroup3 = svg3.append("g").attr("class", "points3");

    function updateEngagementChart(selectedCat) {
      let data = allData3;
      if (selectedCat && selectedCat !== "All categories") {
        data = data.filter(d => d.category === selectedCat);
      }
      if (!data.length) return;

      const engExtent = d3.extent(data, d => d.engagement);
      const earnExtent = d3.extent(data, d => d.earnings);

      const engMax = engExtent[1] * 1.05;
      const earnMin = Math.max(1, earnExtent[0]);
      const earnMax = earnExtent[1] * 1.05;

      x3.domain([0, engMax]);
      y3.domain([earnMin, earnMax]);

      gridY3
        .attr("transform", `translate(${margin3.left},0)`)
        .call(
          d3.axisLeft(y3)
            .ticks(6, "~s")
            .tickSize(-(width3 - margin3.left - margin3.right))
            .tickFormat("")
        )
        .call(g => g.selectAll(".tick line")
          .attr("stroke", gridColor)
          .attr("stroke-dasharray", "4,3")
          .attr("stroke-opacity", 0.7))
        .call(g => g.select(".domain").remove());

      gridX3
        .attr("transform", `translate(0,${height3 - margin3.bottom})`)
        .call(
          d3.axisBottom(x3)
            .ticks(8)
            .tickSize(-(height3 - margin3.top - margin3.bottom))
            .tickFormat("")
        )
        .call(g => g.selectAll(".tick line")
          .attr("stroke", gridColor)
          .attr("stroke-dasharray", "4,3")
          .attr("stroke-opacity", 0.7))
        .call(g => g.select(".domain").remove());

      axisY3
        .call(
          d3.axisLeft(y3)
            .ticks(6, "~s")
            .tickFormat(d => "$" + d3.format(".2s")(d))
        )
        .call(g => g.selectAll("line").remove())
        .call(g => g.selectAll("text").style("font-size", "11px"));

      axisX3
        .call(
          d3.axisBottom(x3)
            .ticks(8)
            .tickFormat(d => d3.format(".0f")(d) + "%")
        )
        .call(g => g.selectAll("line").remove())
        .call(g => g.selectAll("text").style("font-size", "11px"));

      const dots = pointsGroup3.selectAll("circle")
        .data(data, d => d.youtuber);

      dots.enter()
        .append("circle")
        .attr("r", 0)
        .attr("fill", d => color(d.category))
        .attr("fill-opacity", 0.65)
        .attr("stroke", d => d3.color(color(d.category)).darker(0.5))
        .attr("stroke-width", 1)
        .style("cursor", "pointer")
        .merge(dots)
        .transition()
        .duration(400)
        .attr("cx", d => x3(d.engagement))
        .attr("cy", d => y3(d.earnings))
        .attr("r", 4.5);

      dots.exit().transition().duration(300).attr("r", 0).remove();

      pointsGroup3.selectAll("circle")
        .on("mouseenter", (event, d) => {
          d3.select(event.currentTarget)
            .transition().duration(120)
            .attr("r", 8)
            .attr("stroke", "#fff")
            .attr("stroke-width", 2.5)
            .attr("fill-opacity", 1);

          tooltip.style("opacity", 1).html(`
            <strong>${d.youtuber}</strong><br/>
            <span style="color:#aaa;">${d.category}</span><br/>
            <span style="color:#888;">━━━━━━━━━━━</span><br/>
            <strong>Engagement:</strong> ${d.engagement.toFixed(1)}%<br/>
            <strong>Earnings:</strong> $${d3.format(".2s")(d.earnings)}/year<br/>
            <strong>EPV:</strong> $${d.epv.toFixed(5)}
          `);
        })
        .on("mousemove", event => {
          const rect = container.node().getBoundingClientRect();
          tooltip
            .style("left", (event.pageX - rect.left + 20) + "px")
            .style("top", (event.pageY - rect.top - 30) + "px");
        })
        .on("mouseleave", event => {
          d3.select(event.currentTarget)
            .transition().duration(120)
            .attr("r", 4.5)
            .attr("stroke", d3.color(color(d3.category)).darker(0.5))
            .attr("stroke-width", 1)
            .attr("fill-opacity", 0.65);
          tooltip.style("opacity", 0);
        });
    }

    updateEngagementChart("All categories");

    select3.on("change", function () {
      updateEngagementChart(this.value);
    });

    chartContainer3.append("div")
      .style("margin", "20px 0 10px 0")
      .style("font-size", "13px")
      .style("color", "#444")
      .style("line-height", "1.6")
      .html(`
        <strong>Key Insight:</strong>
        Engagement (views per subscriber) is a weaker predictor of total earnings than scale, but some categories
        with very loyal audiences tend to sit higher in earnings for the same engagement rate.
      `);
  }

  // ----------------- CHART 4: Top earners per view -----------------
  const margin4 = { top: 130, right: 120, bottom: 200, left: 320 };
  const width4 = 1200;
  const rowHeight4 = 36;
  const height4 = top_epv.length * rowHeight4 + margin4.top + margin4.bottom;

  const chartContainer4 = renderChartContainer("topearners");

  const svg4 = chartContainer4.append("svg")
    .attr("viewBox", [0, 0, width4, height4])
    .style("font-family", font);

  svg4.append("text")
    .attr("x", width4 / 2)
    .attr("y", 40)
    .attr("text-anchor", "middle")
    .attr("font-size", 24)
    .attr("font-weight", 800)
    .attr("fill", axisColor)
    .text("Top 25 Channels by Earnings per View (EPV)");

  svg4.append("text")
    .attr("x", width4 / 2)
    .attr("y", 60)
    .attr("text-anchor", "middle")
    .attr("font-size", 14)
    .style("fill", labelColor)
    .text("EPV = yearly earnings ÷ total views — channels that earn the most per view, regardless of size.");

  const x4 = d3.scaleLinear()
    .domain([0, d3.max(top_epv, d => d.earnings_per_view) * 1.05])
    .nice()
    .range([margin4.left, width4 - margin4.right]);

  const y4 = d3.scaleBand()
    .domain(top_epv.map(d => d.youtuber))
    .range([margin4.top, height4 - margin4.bottom])
    .padding(0.25);

  svg4.append("g")
    .attr("transform", `translate(0,${margin4.top})`)
    .call(
      d3.axisTop(x4)
        .ticks(10)
        .tickSize(-(height4 - margin4.top - margin4.bottom))
        .tickFormat("")
    )
    .call(g => g.selectAll(".tick line")
      .attr("stroke", gridColor)
      .attr("stroke-opacity", 0.65)
      .attr("stroke-dasharray", "4,2"))
    .call(g => g.select(".domain").remove());

  const barGroup4 = svg4.append("g");

  barGroup4.selectAll("rect")
    .data(top_epv)
    .join("rect")
    .attr("x", x4(0))
    .attr("y", d => y4(d.youtuber))
    .attr("height", y4.bandwidth())
    .attr("fill", d => color(d.category))
    .attr("rx", 3)
    .attr("fill-opacity", 0.9)
    .attr("width", 0)
    .transition()
    .duration(1000)
    .ease(d3.easeQuadOut)
    .attr("width", d => x4(d.earnings_per_view) - x4(0));

  svg4.append("g")
    .attr("transform", `translate(0, ${margin4.top - 20})`)
    .style("color", axisColor)
    .call(d3.axisTop(x4).ticks(10).tickFormat(d3.format(".4f")))
    .call(g => g.selectAll("line").remove());

  svg4.append("g")
    .selectAll("text.channel")
    .data(top_epv)
    .join("text")
    .attr("x", margin4.left - 20)
    .attr("y", d => y4(d.youtuber) + y4.bandwidth() / 2 + 4)
    .attr("text-anchor", "end")
    .attr("font-size", 13)
    .attr("font-weight", 600)
    .attr("fill", axisColor)
    .text(d => d.youtuber);

  svg4.append("g")
    .selectAll("text.epv")
    .data(top_epv)
    .join("text")
    .attr("x", d => x4(d.earnings_per_view) + 8)
    .attr("y", d => y4(d.youtuber) + y4.bandwidth() / 2 + 4)
    .attr("font-size", 13)
    .attr("font-weight", 700)
    .attr("fill", "#008080")
    .text(d => `$${d.earnings_per_view.toFixed(5)}`);

  svg4.append("text")
    .attr("x", width4 / 2)
    .attr("y", margin4.top - 50)
    .attr("text-anchor", "middle")
    .attr("font-size", 16)
    .attr("font-weight", 700)
    .attr("fill", axisColor)
    .text("Earnings per view (USD)");

  svg4.selectAll("rect")
    .on("mouseenter", (event, d) => {
      d3.select(event.currentTarget)
        .attr("fill-opacity", 1)
        .attr("stroke", "#fff")
        .attr("stroke-width", 3);

      tooltip.style("opacity", 1).html(`
        <strong style="font-size: 16px;">${d.youtuber}</strong><br/>
        <span style="color: #ccc;">${d.category}</span><br/>
        <span style="color: #888;">━━━━━━━━━━━</span><br/>
        EPV: <strong style="color: #A0FFA0;">$${d.earnings_per_view.toFixed(5)}</strong><br/>
        Yearly earnings: $${d.avg_yearly_earnings.toLocaleString()}<br/>
        Subscribers: ${d.subscribers.toLocaleString()}
      `);
    })
    .on("mousemove", event => {
      const rect = container.node().getBoundingClientRect();
      tooltip.style("left", (event.pageX - rect.left + 20) + "px")
             .style("top", (event.pageY - rect.top - 30) + "px");
    })
    .on("mouseleave", event => {
      d3.select(event.currentTarget)
        .attr("fill-opacity", 0.9)
        .attr("stroke", "none");
      tooltip.style("opacity", 0);
    });

  chartContainer4.append("div")
    .style("margin", "25px 0 20px 0")
    .style("padding", "16px 20px")
    .style("background", "transparent")
    .style("border-radius", "8px")
    .style("font-size", "14px")
    .style("color", "#444")
    .style("line-height", "1.6")
    .html(`
      <strong>Key insight:</strong>
      These channels “win” on a per-view basis. Many are niche or high-intent topics
      (e.g., finance, tech, education), where advertisers pay premium CPMs even if total audience size is smaller.
    `);

  // legend at bottom
  createLegend(container, categories, color);

  return container.node();
}


function _20(md){return(
md`## Question 4: Do more subscribers always mean more views? Which channels have the most engaged audiences?`
)}

function _21(md){return(
md`
### Overview Summary  
This dashboard analyzes engagement and scale patterns across nearly 900 YouTube channels.  
While subscriber counts and view totals typically move together (correlation ≈ **0.9**), the **efficiency of that audience**—measured by *views per subscriber*—varies wildly across categories.  
Three coordinated visualizations reveal how category characteristics, audience loyalty, and channel-level engagement shape performance.

---

## Visualization Design  

### **1. Stratified Scatter Plot — Subscribers vs. Views**
**X-axis:** Total subscribers (log scale)  
**Y-axis:** Total video views (log scale)  
**Color:** Content category  
**Data:** Lightly sampled (≈30%) to avoid clutter  

**Why this encoding?**  
A log–log scatter plot best captures scaling behavior across many orders of magnitude.  
Sampling preserves the global shape of the data while removing chart overcrowding.  
The strong diagonal trend shows:  
- Larger audiences → more total views  
- Categories cluster differently (Entertainment & Music dominate the high-scale region)

**Key Insight:**  
Channels with similar subscriber counts can have **5× differences in total views**.  
This reveals that *viewer loyalty and repeat watching* strongly affect total reach.

---

### **2. Radar Chart — Category Engagement Profile (Normalized)**
**Metrics included:**  
- Average subscribers  
- Average views  
- Average views per subscriber (engagement)  
- Number of channels in the category  

**Why this encoding?**  
A radar chart reveals *multi-dimensional category strengths* in a single shape.  
By normalizing metrics (0–1), categories can be compared fairly despite different scales.

**What it shows:**  
- Entertainment scores high on scale (subs/views) but not on engagement  
- Education has **exceptionally high views-per-subscriber**, indicating repeat watching  
- Music is strong on engagement *and* views  
- Some categories have many small creators (broad base but low averages)

**Key Insight:**  
Category performance is not one-dimensional—scale, loyalty, and volume of creators differ dramatically.

---

### **3. Top 25 Engagement Leaders — Views per Subscriber Ranking**
**Bar length:** Views per subscriber (engagement score)  
**Color:** Category  
**Ordering:** Highest engagement first  

**Why this encoding?**  
A horizontal bar ranking clearly shows which channels punch far above their weight by producing content audiences repeatedly return to.

**What it reveals:**  
- The highest-engagement channels often are not the largest  
- Kids, Education, and Music dominate the upper ranks  
- Some channels have *10× better engagement* than others with the same subscriber count

**Key Insight:**  
Engagement leaders demonstrate viewer loyalty and content stickiness—often more valuable than raw popularity.

---

## Critical Cross-Chart Insight  
Each visualization focuses on a different axis of success:

| Visualization | Ranking Metric | Reveals |
|--------------|----------------|---------|
| Scatter Plot | Scale (subs + views) | Who reaches the largest total audience |
| Radar Chart | Multi-metric category profile | Structural category strengths/weaknesses |
| Engagement Bars | Views per subscriber | Audience loyalty & content replay value |

This separation makes it clear that **“scale ≠ engagement ≠ loyalty.”**

Example:  
- A gaming channel with 20M subs but low engagement appears large in the scatter plot but falls off the engagement ranking.  
- A kids/education channel may appear modest in scale but rank extremely high in views-per-subscriber.

---

## Key Findings  

### **1. Scale and Views Grow Together—but Not Evenly**  
Large channels predictably sit in the upper-right of the scatter plot.  
Yet channels with the *same* subscriber base can differ massively in total views due to binge-watching or evergreen content.

### **2. Categories Have Distinct Structural Patterns**  
Radar profiles show:  
- **Entertainment** → strongest in raw scale  
- **Music** → high engagement, high playback rates  
- **Education & Kids** → unusual loyalty & very high repeat viewing  
- **People & Blogs** → fragmented, inconsistent engagement  
- **Gaming** → surprisingly low engagement relative to subscriber count  

### **3. Engagement Leaders Are Often Niche, Not Mega-Scale**  
Top 25 engagement channels are not always the most famous or largest—  
they succeed through **audience depth**, not width.

---

## Why This Matters  
YouTube success involves **three independent axes**:

1. **Audience Size** — how many people subscribe  
2. **Audience Reach** — how often content is actually watched  
3. **Audience Loyalty** — how repeatable and binge-worthy the content is  

The Q4 dashboards highlight which channels and categories excel in each dimension.

### Actionable Insight  
If the goal is growth: target scale-heavy categories.  
If the goal is earnings or advertiser value: focus on **engagement-heavy categories**—  
where viewers actively return rather than passively follow.

---

## Conclusion  
This dashboard reveals that channel size and content success are not the same.  
A creator with fewer subscribers can outperform massive channels through superior engagement, content replay value, and niche audience loyalty.  
Understanding these multi-dimensional patterns helps explain why some channels become cultural phenomena while others, despite large followings, struggle to convert attention into meaningful engagement.

`
)}

function _question_4_complete_dashboard(q4_prepared_data,d3)
{
  const { scatterData, engagementLeaders, categories, corrLog } = q4_prepared_data;

  const dashboardWidth = 1400;
  const font = "Inter, sans-serif";
  const axisColor = "#333";
  const labelColor = "#374151";
  const backgroundColor = "#fcfcfc";
  const gridColor = "#eaeaea";

  const customSpectral = [
    "#9e0142", "#d53e4f", "#f46d43", "#fdae61",
    "#fee08b",
    "#a6d96a", "#66c2a5", "#3288bd", "#5e4fa2",
    "#7c0060",
    "#006837"
  ];
  const palette = [...customSpectral, ...d3.schemeSet3];

  const color = d3.scaleOrdinal()
    .domain(categories)
    .range(palette);

  const fmtSI = d3.format(".2s");
  const fmtInt = d3.format(",");

  // ------------------ STATE & LAYOUT ------------------
  let activeChartId = "scatter";

  const chartOptions = [
    { id: "scatter", label: "Channel Scale vs Views" },
    { id: "radar",   label: "Category Engagement Profile" },
    { id: "leaders", label: "Top 25 Engagement Channels" }
  ];

  const container = d3.create("div")
    .style("font-family", font)
    .style("background", "#f5f5f5")
    .style("padding", "0")
    .style("margin", "0")
    .style("position", "relative");

  // ------------------ HEADER ------------------
  const header = container.append("div")
    .attr("id", "dashboard-header-q4")
    .style("width", "100%")
    .style("background", backgroundColor)
    .style("padding", "0")
    .style("margin", "0")
    .style("position", "relative")
    .style("height", "130px");

  header.append("div")
    .style("position", "absolute")
    .style("left", "50%")
    .style("top", "0")
    .style("transform", "translateX(-50%)")
    .style("text-align", "center")
    .style("width", "100%")
    .style("font-size", "30px")
    .style("font-weight", "900")
    .style("color", "#222")
    .style("margin-top", "0px")
    .text("Engagement, Scale, and Audience Quality");

  const corrText = Number.isFinite(corrLog) ? corrLog.toFixed(2) : "N/A";

  header.append("div")
    .style("position", "absolute")
    .style("left", "50%")
    .style("top", "50px")
    .style("transform", "translateX(-50%)")
    .style("text-align", "center")
    .style("width", "100%")
    .style("font-size", "18px")
    .style("font-weight", "500")
    .style("color", "#555")
    .text(
      `How do subscribers and views scale together  and which channels have the most engaged audiences?`
    );

  // ------------------ TAB SWITCH (PILLS) ------------------
  const menuContainer = container.append("div")
    .style("margin", "0 auto")
    .style("padding", "20px 0 14px 0")
    .style("text-align", "center")
    .style("background", backgroundColor);

  const tabWrapper = menuContainer.append("div")
    .style("display", "inline-flex")
    .style("border-radius", "999px")
    .style("border", "1px solid #ddd")
    .style("background", "#f9fafb")
    .style("overflow", "hidden");

  const tabs = tabWrapper.selectAll("button")
    .data(chartOptions)
    .enter()
    .append("button")
    .style("border", "none")
    .style("padding", "8px 20px")
    .style("font-family", font)
    .style("font-size", "14px")
    .style("cursor", "pointer")
    .style("background", d => d.id === activeChartId ? "#111827" : "transparent")
    .style("color", d => d.id === activeChartId ? "#f9fafb" : "#374151")
    .style("font-weight", d => d.id === activeChartId ? "700" : "500")
    .style("transition", "background 0.15s ease, color 0.15s ease")
    .on("click", (event, d) => {
      activeChartId = d.id;
      updateContentDisplay(activeChartId);
      tabs
        .style("background", t => t.id === activeChartId ? "#111827" : "transparent")
        .style("color", t => t.id === activeChartId ? "#f9fafb" : "#374151")
        .style("font-weight", t => t.id === activeChartId ? "700" : "500");
    })
    .text(d => d.label);

  container.append("div")
    .style("max-width", dashboardWidth + "px")
    .style("margin", "0 auto")
    .style("border-bottom", "1px solid #ddd");

  const contentArea = container.append("div")
    .attr("id", "dashboard-content-area-q4")
    .style("padding", "40px 60px 0px 60px")
    .style("background", "#f5f5f5")
    .style("min-height", "800px");

  // ------------------ SHARED TOOLTIP ------------------
  const tooltip = container.append("div")
    .style("position", "absolute")
    .style("background", "rgba(20,20,20,0.95)")
    .style("color", "#fff")
    .style("padding", "12px 16px")
    .style("border-radius", "8px")
    .style("font-size", "13px")
    .style("font-family", font)
    .style("line-height", "1.5")
    .style("opacity", 0)
    .style("pointer-events", "none")
    .style("box-shadow", "0 4px 12px rgba(0,0,0,0.4)")
    .style("z-index", "10000");

  const renderChartContainer = id =>
    contentArea.append("div")
      .attr("id", `q4-chart-${id}`)
      .style("display", activeChartId === id ? "block" : "none")
      .style("background", backgroundColor)
      .style("border-radius", "12px")
      .style("padding", "30px")
      .style("box-shadow", "0 8px 20px rgba(0,0,0,0.08)")
      .style("margin", "0 auto")
      .style("max-width", "1200px");

  const updateContentDisplay = newId => {
    chartOptions.forEach(opt => {
      d3.select(`#q4-chart-${opt.id}`)
        .style("display", opt.id === newId ? "block" : "none");
    });
  };

  // ------------------ CHART 1: STRATIFIED SCATTER ------------------
  {
    const margin = { top: 70, right: 60, bottom: 90, left: 110 };
    const width = 1200;
    const height = 720;

    const chart = renderChartContainer("scatter");
    const svg = chart.append("svg")
      .attr("viewBox", [0, 0, width, height])
      .style("font-family", font);

    svg.append("text")
      .attr("x", width / 2)
      .attr("y", 30)
      .attr("text-anchor", "middle")
      .attr("font-size", 22)
      .attr("font-weight", 800)
      .attr("fill", axisColor)
      .text("Channel Scale vs Total Views (Sampled)");

    svg.append("text")
      .attr("x", width / 2)
      .attr("y", 52)
      .attr("text-anchor", "middle")
      .attr("font-size", 13)
      .style("fill", labelColor)
      .text("Sample of channels, colored by category — larger channels move up and to the right.");

    const sampled = scatterData.filter((_, i) => i % 3 === 0);

    const subsExtent = d3.extent(sampled, d => d.subscribers);
    const viewsExtent = d3.extent(sampled, d => d.views);

    const subsMin = Math.max(1, subsExtent[0]);
    const subsMax = subsExtent[1] * 1.1;
    const viewsMin = Math.max(1, viewsExtent[0]);
    const viewsMax = viewsExtent[1] * 1.1;

    const x = d3.scaleLog()
      .domain([subsMin, subsMax])
      .range([margin.left, width - margin.right])
      .clamp(true);

    const y = d3.scaleLog()
      .domain([viewsMin, viewsMax])
      .range([height - margin.bottom, margin.top])
      .clamp(true);

    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(
        d3.axisLeft(y)
          .ticks(7, "~s")
          .tickSize(-(width - margin.left - margin.right))
          .tickFormat("")
      )
      .call(g => g.selectAll(".tick line")
        .attr("stroke", gridColor)
        .attr("stroke-dasharray", "4,3")
        .attr("stroke-opacity", 0.7))
      .call(g => g.select(".domain").remove());

    svg.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(
        d3.axisBottom(x)
          .ticks(7, "~s")
          .tickSize(-(height - margin.top - margin.bottom))
          .tickFormat("")
      )
      .call(g => g.selectAll(".tick line")
        .attr("stroke", gridColor)
        .attr("stroke-dasharray", "4,3")
        .attr("stroke-opacity", 0.7))
      .call(g => g.select(".domain").remove());

    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(
        d3.axisLeft(y)
          .ticks(7, "~s")
          .tickFormat(d => fmtSI(d))
      )
      .call(g => g.selectAll("line").remove())
      .call(g => g.selectAll("text").style("font-size", "11px"));

    svg.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(
        d3.axisBottom(x)
          .ticks(7, "~s")
          .tickFormat(d => fmtSI(d))
      )
      .call(g => g.selectAll("line").remove())
      .call(g => g.selectAll("text").style("font-size", "11px"));

    svg.append("text")
      .attr("x", width / 2)
      .attr("y", height - margin.bottom + 45)
      .attr("text-anchor", "middle")
      .attr("font-size", 14)
      .attr("font-weight", 600)
      .attr("fill", axisColor)
      .text("Total Subscribers (log scale) →");

    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", 30)
      .attr("text-anchor", "middle")
      .attr("font-size", 14)
      .attr("font-weight", 600)
      .attr("fill", axisColor)
      .text("↑ Total Video Views (log scale)");

    const pointsGroup = svg.append("g");

    pointsGroup.selectAll("circle")
      .data(sampled, d => d.youtuber)
      .join("circle")
      .attr("cx", d => x(d.subscribers))
      .attr("cy", d => y(d.views))
      .attr("r", 4)
      .attr("fill", d => color(d.category))
      .attr("fill-opacity", 0.7)
      .attr("stroke", d => d3.color(color(d.category)).darker(0.6))
      .attr("stroke-width", 1)
      .style("cursor", "pointer")
      .on("mouseenter", (event, d) => {
        d3.select(event.currentTarget)
          .transition().duration(120)
          .attr("r", 7)
          .attr("stroke", "#fff")
          .attr("stroke-width", 2.5)
          .attr("fill-opacity", 1);

        tooltip.style("opacity", 1).html(`
          <strong>${d.youtuber}</strong><br/>
          <span style="color:#aaa;">${d.category} · ${d.country}</span><br/>
          <span style="color:#888;">━━━━━━━━━━━</span><br/>
          Subscribers: ${fmtInt(d.subscribers)}<br/>
          Views: ${fmtInt(d.views)}<br/>
          Views per subscriber: ${d.engagement.toFixed(1)}
        `);
      })
      .on("mousemove", event => {
        const rect = container.node().getBoundingClientRect();
        tooltip
          .style("left", (event.pageX - rect.left + 20) + "px")
          .style("top", (event.pageY - rect.top - 30) + "px");
      })
      .on("mouseleave", event => {
        d3.select(event.currentTarget)
          .transition().duration(120)
          .attr("r", 4)
          .attr("stroke-width", 1)
          .attr("fill-opacity", 0.7);
        tooltip.style("opacity", 0);
      });

    chart.append("div")
      .style("margin", "22px 0 10px 0")
      .style("font-size", "13px")
      .style("color", "#444")
      .style("line-height", "1.6")
      .html(`
        <strong>Interpretation:</strong>
        Larger channels cluster in the upper-right, showing a strong scaling relationship between subscribers and views.
        The color encoding lets you compare how different content categories populate this scale space.
      `);
  }

  // ------------------ CHART 2: CATEGORY RADAR PROFILE ------------------
  {
    const margin = { top: 80, right: 40, bottom: 80, left: 40 };
    const width = 800;
    const height = 720;
    const centerX = width / 2;
    const centerY = height / 2 + 20;
    const radius = Math.min(width, height) / 2 - 90;

    const chart = renderChartContainer("radar");

    const titleBlock = chart.append("div")
      .style("margin-bottom", "8px");

    titleBlock.append("h2")
      .style("margin", "0")
      .style("font-size", "22px")
      .style("font-weight", "800")
      .style("color", axisColor)
      .text("Category Engagement Profile (Normalized)");

    titleBlock.append("p")
      .style("margin", "4px 0 12px 0")
      .style("font-size", "13px")
      .style("color", labelColor)
      .text("Radar chart comparing categories across subscribers, views, engagement, and channel count (normalized).");

    const svg = chart.append("svg")
      .attr("viewBox", [0, 0, width, height])
      .style("font-family", font);

    const grouped = d3.group(scatterData, d => d.category);
    let catStats = Array.from(grouped, ([category, rows]) => ({
      category,
      avgSubs: d3.mean(rows, d => d.subscribers),
      avgViews: d3.mean(rows, d => d.views),
      avgEngagement: d3.mean(rows, d => d.engagement),
      count: rows.length
    })).filter(d => d.count >= 5);

    catStats = catStats
      .sort((a, b) => d3.descending(a.count, b.count))
      .slice(0, 8);

    const metrics = [
      { key: "avgSubs", label: "Avg Subscribers" },
      { key: "avgViews", label: "Avg Views" },
      { key: "avgEngagement", label: "Avg Views per Subscriber" },
      { key: "count", label: "Channel Count" }
    ];

    const normStats = (() => {
      const out = [];
      metrics.forEach(m => {
        const vals = catStats.map(d => d[m.key]);
        const min = d3.min(vals);
        const max = d3.max(vals);
        catStats.forEach((d, i) => {
          if (!out[i]) out[i] = { ...d, norm: {} };
          let v = d[m.key];
          let nv = (max === min) ? 0.5 : (v - min) / (max - min);
          out[i].norm[m.key] = nv;
        });
      });
      return out;
    })();

    const angleStep = (Math.PI * 2) / metrics.length;
    const rScale = d3.scaleLinear().domain([0, 1]).range([0, radius]);

    const levels = [0.25, 0.5, 0.75, 1];
    const grid = svg.append("g").attr("transform", `translate(${centerX},${centerY})`);

    levels.forEach(l => {
      grid.append("circle")
        .attr("r", rScale(l))
        .attr("fill", "none")
        .attr("stroke", gridColor)
        .attr("stroke-dasharray", "4,3")
        .attr("stroke-opacity", 0.7);
    });

    const axes = svg.append("g").attr("transform", `translate(${centerX},${centerY})`);

    metrics.forEach((m, i) => {
      const angle = i * angleStep - Math.PI / 2;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;

      axes.append("line")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", x)
        .attr("y2", y)
        .attr("stroke", "#d1d5db")
        .attr("stroke-width", 1);

      const labelOffset = 18;
      const lx = Math.cos(angle) * (radius + labelOffset);
      const ly = Math.sin(angle) * (radius + labelOffset);

      axes.append("text")
        .attr("x", lx)
        .attr("y", ly)
        .attr("text-anchor", Math.abs(Math.cos(angle)) < 0.3 ? "middle" : (Math.cos(angle) > 0 ? "start" : "end"))
        .attr("dy", "0.35em")
        .attr("font-size", 11)
        .attr("font-weight", 600)
        .attr("fill", axisColor)
        .text(m.label);
    });

    const radarGroup = svg.append("g").attr("transform", `translate(${centerX},${centerY})`);

    const line = d3.lineRadial()
      .radius(d => d.r)
      .angle(d => d.angle)
      .curve(d3.curveCardinalClosed);

    radarGroup.selectAll("path")
      .data(normStats)
      .join("path")
      .attr("d", d => {
        const points = metrics.map((m, i) => ({
          angle: i * angleStep,
          r: rScale(d.norm[m.key])
        }));
        return line(points);
      })
      .attr("fill", d => color(d.category))
      .attr("fill-opacity", 0.12)
      .attr("stroke", d => d3.color(color(d.category)).darker(0.5))
      .attr("stroke-width", 2)
      .style("cursor", "pointer")
      .on("mouseenter", function (event, d) {
        d3.select(this)
          .transition().duration(150)
          .attr("fill-opacity", 0.25)
          .attr("stroke-width", 3);

        tooltip.style("opacity", 1).html(`
          <strong>${d.category}</strong><br/>
          <span style="color:#888;">━━━━━━━━━━━</span><br/>
          Avg subscribers: ${fmtSI(d.avgSubs)}<br/>
          Avg views: ${fmtSI(d.avgViews)}<br/>
          Avg views/subscriber: ${d.avgEngagement.toFixed(1)}<br/>
          Channel count: ${d.count}
        `);
      })
      .on("mousemove", event => {
        const rect = container.node().getBoundingClientRect();
        tooltip
          .style("left", (event.pageX - rect.left + 20) + "px")
          .style("top", (event.pageY - rect.top - 30) + "px");
      })
      .on("mouseleave", function () {
        d3.select(this)
          .transition().duration(150)
          .attr("fill-opacity", 0.12)
          .attr("stroke-width", 2);
        tooltip.style("opacity", 0);
      });

    chart.append("div")
      .style("margin", "22px 0 10px 0")
      .style("font-size", "13px")
      .style("color", "#444")
      .style("line-height", "1.6")
      .html(`
        <strong>Interpretation:</strong>
        Each polygon is a content category. The further out a category reaches on a spoke, the stronger it is on that metric.
        This makes it easy to see which categories are big, which are highly viewed, and which have especially engaged audiences.
      `);
  }

  // ------------------ CHART 3: TOP 25 ENGAGEMENT LEADERS ------------------
  {
    const margin = { top: 120, right: 150, bottom: 160, left: 320 };
    const width = 1200;
    const rowHeight = 34;
    const data = engagementLeaders
      .slice()
      .sort((a, b) => b.engagement - a.engagement)
      .slice(0, 25);

    const height = data.length * rowHeight + margin.top + margin.bottom;

    const chart = renderChartContainer("leaders");

    const svg = chart.append("svg")
      .attr("viewBox", [0, 0, width, height])
      .style("font-family", font);

    svg.append("text")
      .attr("x", width / 2)
      .attr("y", 40)
      .attr("text-anchor", "middle")
      .attr("font-size", 24)
      .attr("font-weight", 800)
      .attr("fill", axisColor)
      .text("Top 25 Channels by Engagement (Views per Subscriber)");

    svg.append("text")
      .attr("x", width / 2)
      .attr("y", 60)
      .attr("text-anchor", "middle")
      .attr("font-size", 14)
      .style("fill", labelColor)
      .text("Channels with large audiences that repeatedly watch their content — high views per subscriber.");

    const x = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.engagement) * 1.05])
      .nice()
      .range([margin.left, width - margin.right]);

    const y = d3.scaleBand()
      .domain(data.map(d => d.youtuber))
      .range([margin.top, height - margin.bottom])
      .padding(0.25);

    svg.append("g")
      .attr("transform", `translate(0,${margin.top})`)
      .call(
        d3.axisTop(x)
          .ticks(8)
          .tickSize(-(height - margin.top - margin.bottom))
          .tickFormat("")
      )
      .call(g => g.selectAll(".tick line")
        .attr("stroke", gridColor)
        .attr("stroke-opacity", 0.65)
        .attr("stroke-dasharray", "4,2"))
      .call(g => g.select(".domain").remove());

    svg.append("g")
      .attr("transform", `translate(0,${margin.top - 20})`)
      .style("color", axisColor)
      .call(
        d3.axisTop(x)
          .ticks(8)
          .tickFormat(d => d.toFixed(1))
      )
      .call(g => g.selectAll("line").remove())
      .call(g => g.selectAll("text").style("font-size", "11px"));

    svg.append("text")
      .attr("x", width / 2)
      .attr("y", margin.top - 45)
      .attr("text-anchor", "middle")
      .attr("font-size", 15)
      .attr("font-weight", 700)
      .attr("fill", axisColor)
      .text("Views per Subscriber (Engagement)");

    svg.append("g")
      .selectAll("text.channel")
      .data(data)
      .join("text")
      .attr("x", margin.left - 20)
      .attr("y", d => y(d.youtuber) + y.bandwidth() / 2 + 4)
      .attr("text-anchor", "end")
      .attr("font-size", 13)
      .attr("font-weight", 600)
      .attr("fill", axisColor)
      .text(d => d.youtuber);

    const bars = svg.append("g")
      .selectAll("rect")
      .data(data)
      .join("rect")
      .attr("x", x(0))
      .attr("y", d => y(d.youtuber))
      .attr("height", y.bandwidth())
      .attr("fill", d => color(d.category))
      .attr("rx", 3)
      .attr("fill-opacity", 0.9)
      .attr("width", 0);

    bars.transition()
      .duration(900)
      .ease(d3.easeQuadOut)
      .attr("width", d => x(d.engagement) - x(0));

    svg.append("g")
      .selectAll("text.eng")
      .data(data)
      .join("text")
      .attr("x", d => x(d.engagement) + 8)
      .attr("y", d => y(d.youtuber) + y.bandwidth() / 2 + 4)
      .attr("font-size", 12)
      .attr("font-weight", 700)
      .attr("fill", "#047857")
      .text(d => d.engagement.toFixed(1));

    bars
      .on("mouseenter", (event, d) => {
        d3.select(event.currentTarget)
          .attr("fill-opacity", 1)
          .attr("stroke", "#fff")
          .attr("stroke-width", 3);

        tooltip.style("opacity", 1).html(`
          <strong style="font-size: 15px;">${d.youtuber}</strong><br/>
          <span style="color:#ccc;">${d.category} · ${d.country}</span><br/>
          <span style="color:#888;">━━━━━━━━━━━</span><br/>
          Views per subscriber: ${d.engagement.toFixed(1)}<br/>
          Subscribers: ${fmtInt(d.subscribers)}<br/>
          Views: ${fmtInt(d.views)}
        `);
      })
      .on("mousemove", event => {
        const rect = container.node().getBoundingClientRect();
        tooltip
          .style("left", (event.pageX - rect.left + 20) + "px")
          .style("top", (event.pageY - rect.top - 30) + "px");
      })
      .on("mouseleave", event => {
        d3.select(event.currentTarget)
          .attr("fill-opacity", 0.9)
          .attr("stroke", "none");
        tooltip.style("opacity", 0);
      });

    chart.append("div")
      .style("margin", "25px 0 20px 0")
      .style("padding", "16px 20px")
      .style("background", "transparent")
      .style("border-radius", "8px")
      .style("font-size", "14px")
      .style("color", "#444")
      .style("line-height", "1.6")
      .html(`
        <strong>Interpretation:</strong>
        These channels get many views per subscriber, indicating repeat watching and a highly engaged core audience.
        Notice that some categories (like kids, music, or entertainment) dominate the top of this ranking.
      `);
  }

  // ------------------ COMMON CATEGORY LEGEND ------------------
  (function createLegend() {
    const legendWrapper = container.append("div")
      .style("margin", "0 auto")
      .style("max-width", "1200px")
      .style("padding", "30px 60px 40px 60px")
      .style("background", "#f5f5f5");

    legendWrapper.append("h2")
      .style("font-size", "20px")
      .style("font-weight", "800")
      .style("margin-bottom", "16px")
      .style("color", axisColor)
      .text("Category Legend");

    const legend = legendWrapper.append("div")
      .style("display", "grid")
      .style("grid-template-columns", "repeat(auto-fit, minmax(200px, 1fr))")
      .style("gap", "10px 15px");

    categories.forEach(cat => {
      const item = legend.append("div")
        .style("display", "flex")
        .style("align-items", "center")
        .style("padding", "4px 8px")
        .style("border-radius", "6px")
        .style("cursor", "default");

      item.append("div")
        .style("width", "14px")
        .style("height", "14px")
        .style("border-radius", "50%")
        .style("background", color(cat))
        .style("border", `2px solid ${d3.color(color(cat)).darker(0.5)}`)
        .style("flex-shrink", "0");

      item.append("span")
        .style("margin-left", "10px")
        .style("font-size", "13px")
        .style("color", "#444")
        .text(cat);
    });
  })();

  return container.node();
}


function _23(md){return(
md`# Question 5: Evolution of YouTube Success (2005–2023)

## Overview

I analyzed how YouTube's creator economy evolved from 2005 to 2023 using data from 899 top channels. The data includes creation year, category, subscriber counts, and video views. I divided the timeline into four eras: Early Days (2005-2010), Growth Era (2010-2015), Modern Era (2015-2020), and Post-2020 (2020-2023).

The main question is: How has YouTube success changed over time? Which categories rose or fell? How did different eras affect creator success?

---

## What I'm Analyzing and Why

A single snapshot of YouTube data doesn't show how things changed over time. Categories that are popular now might have been small in 2005. To understand evolution, I need to look at patterns across different time periods.

I created six visualizations that work together:
1. **Radial Timeline** - Shows which categories dominated in each era
2. **Network Evolution** - Shows how categories relate to each other in each era
3. **Parallel Coordinates** - Compares categories across different metrics
4. **Success Heatmap** - Shows which years were best for each category
5. **Stream Graph** - Shows how category dominance changed over time
6. **Cohort Analysis** - Shows channel creation and subscriber patterns by era

---

## Visualization Design

### 1. Radial Timeline
Shows category dominance across eras using concentric rings. Inner rings are earlier eras, outer rings are later. Each category gets a slice proportional to its channel count. This lets me compare which categories were big in each era.

### 2. Network Evolution
Four small network graphs, one for each era. Categories are nodes (bigger = more channels), connected by links showing similarity. Thicker links mean categories grew together. This shows which categories cluster together and how that changed.

### 3. Parallel Coordinates
Multiple axes showing different metrics (subscribers, views, channel count). Each category is a line connecting its values. Lines that stay high across all axes are winners in multiple ways. Lines with peaks in one area are specialized.

### 4. Success Heatmap
Rows are categories, columns are years. Color shows average subscribers - darker means higher. This shows when each category peaked and reveals patterns over time.

### 5. Stream Graph
Stacked areas showing category proportions over time. The baseline is centered so you can see which categories are above or below average. This shows smooth changes in dominance.

### 6. Cohort Analysis
Two parts: left side shows cumulative channel creation by cohort (when channels were created), right side shows box plots of subscriber distribution by era. This separates creation patterns from success patterns.

---

## Why Six Charts Together

Each chart answers a different question, but they're all linked. When you click an era, category, or year, all charts highlight that selection. Other elements fade to show context. This lets you explore relationships across different views.

For example, clicking "Modern Era" shows how Gaming surged (stream graph), how category relationships changed (network), and how subscriber distributions shifted (cohort analysis) all at once.

---

## Key Findings

1. **Era-Specific Patterns:**
   - Early Days: People & Blogs and Entertainment had lots of channels
   - Growth Era: Music and Entertainment became dominant
   - Modern Era: Gaming and Howto & Style surged
   - Post-2020: Education and Science & Technology grew

2. **Category Relationships:**
   - Entertainment and Music stayed similar across all eras
   - Education and Science & Technology clustered together in Post-2020
   - Relationships changed as the platform evolved

3. **Peak Years:**
   - Music peaked around 2012-2015
   - Gaming peaked around 2016-2019
   - Education peaked around 2020-2022

4. **Cohort Effects:**
   - More channels were created over time (acceleration)
   - Subscriber medians increased, but variance grew too
   - Exceptional channels appeared in all eras

5. **Multi-Dimensional Success:**
   - Entertainment and Music do well across multiple metrics
   - Education has high subscribers-per-channel
   - Gaming has high channel count
   - No single category wins everything

---

## How to Use the Dashboard

Click any era, category, or year to see it highlighted across all charts. Hover for details. The year scrubber lets you navigate through time precisely. This coordinated view helps you see how different aspects of evolution relate to each other.

---

## Conclusion

YouTube evolved significantly from 2005 to 2023. Categories rise, peak, and decline at different times. The platform changed from individual creators to a more structured ecosystem. Different eras had different dominant categories, and success patterns shifted over time.

**Main Insights:**
- Categories that dominated early may decline later
- Era-specific factors (algorithms, trends) impact success
- Success is multi-dimensional - no category wins everything
- Temporal analysis reveals patterns that static snapshots miss`
)}

function _q5_categoryTable(data,d3,Inputs)
{
  // Use existing 'data' variable from your notebook
  // Process it the same way as Q5 visualization
  const cleanNumber = v => (Number.isFinite(v) && v > 0 ? +v : null);

  const processedData = data
    .map(d => ({
      category: d.category,
      year: cleanNumber(d.created_year),
      // Handle different possible field names
      subs: cleanNumber(d.subscribers || d.Subscribers || d.subs),
      views: cleanNumber(d.video_views || d["video views"] || d["Video Views"] || d.views)
    }))
    .filter(d => d.year >= 2005 && d.year <= 2023 && d.subs !== null && d.category && d.category !== "nan");

  // Calculate category statistics using d3.rollups (same pattern as your friends)
  const categoryStats = d3.rollups(
    processedData,
    v => {
      const validSubs = v.map(d => d.subs).filter(d => d !== null);
      const validViews = v.map(d => d.views).filter(d => d !== null);
      const validYears = v.map(d => d.year).filter(d => d !== null);
      
      const avgSubs = validSubs.length > 0 ? d3.mean(validSubs) : null;
      const avgViews = validViews.length > 0 ? d3.mean(validViews) : null;
      const totalSubs = validSubs.length > 0 ? d3.sum(validSubs) : null;
      const totalViews = validViews.length > 0 ? d3.sum(validViews) : null;
      const avgYear = validYears.length > 0 ? d3.mean(validYears) : null;
      
      return {
        count: v.length,
        avgSubscribers: (avgSubs !== null && Number.isFinite(avgSubs)) ? avgSubs : null,
        avgViews: (avgViews !== null && Number.isFinite(avgViews)) ? avgViews : null,
        totalSubscribers: (totalSubs !== null && Number.isFinite(totalSubs)) ? totalSubs : null,
        totalViews: (totalViews !== null && Number.isFinite(totalViews)) ? totalViews : null,
        avgYearCreated: (avgYear !== null && Number.isFinite(avgYear)) ? avgYear : null,
        earliestYear: validYears.length > 0 ? d3.min(validYears) : null,
        latestYear: validYears.length > 0 ? d3.max(validYears) : null
      };
    },
    d => d.category
  );

  const tableData = categoryStats
    .map(([category, stats]) => ({
      Category: category,
      Count: stats.count,
      "Avg Subscribers": (stats.avgSubscribers !== null && Number.isFinite(stats.avgSubscribers))
        ? Math.round(stats.avgSubscribers).toLocaleString() 
        : "N/A",
      "Total Subscribers": (stats.totalSubscribers !== null && Number.isFinite(stats.totalSubscribers))
        ? Math.round(stats.totalSubscribers).toLocaleString() 
        : "N/A",
      "Avg Views": (stats.avgViews !== null && Number.isFinite(stats.avgViews))
        ? Math.round(stats.avgViews).toLocaleString() 
        : "N/A",
      "Total Views": (stats.totalViews !== null && Number.isFinite(stats.totalViews))
        ? Math.round(stats.totalViews).toLocaleString() 
        : "N/A",
      "Avg Year Created": (stats.avgYearCreated !== null && Number.isFinite(stats.avgYearCreated))
        ? Math.round(stats.avgYearCreated) 
        : "N/A",
      "Earliest Year": (stats.earliestYear !== null && Number.isFinite(stats.earliestYear)) ? stats.earliestYear : "N/A",
      "Latest Year": (stats.latestYear !== null && Number.isFinite(stats.latestYear)) ? stats.latestYear : "N/A"
    }))
    .sort((a, b) => b.Count - a.Count);

  return Inputs.table(tableData, {
    format: {
      "Count": d3.format(","),
      "Avg Subscribers": (v) => typeof v === "string" ? v : (Number.isFinite(v) ? d3.format(",")(v) : "N/A"),
      "Total Subscribers": (v) => typeof v === "string" ? v : (Number.isFinite(v) ? d3.format(",")(v) : "N/A"),
      "Avg Views": (v) => typeof v === "string" ? v : (Number.isFinite(v) ? d3.format(",")(v) : "N/A"),
      "Total Views": (v) => typeof v === "string" ? v : (Number.isFinite(v) ? d3.format(",")(v) : "N/A")
    }
  });
}


function _q5_evolution(data,d3)
{
    const CFG = {
    W: 2000,
    H: 3200,
        PAD: 60,
    GRID_GAP: 45,
    CARD_PAD: 35,
        FONT: "14px/1.5 'Inter', system-ui, sans-serif"
    };

  const AXIS_CONFIG = {
    tickFontSize: 12,
    tickFontWeight: 500,
    tickFill: "#1e293b",
    tickLineWidth: 2,
    tickLineColor: "#334155",
    domainWidth: 2.5,
    domainColor: "#334155",
    gridWidth: 1.5,
    gridColor: "#e2e8f0",
    labelFontSize: 13,
    labelFontWeight: 700,
    labelFill: "#0f172a"
  };

  
  const cleanNumber = v => (Number.isFinite(v) && v > 0 ? +v : null);

  const processedData = data
        .map(d => ({
            Channel: d.Youtuber,
      year: cleanNumber(d.created_year),
            category: d.category,
      subs: cleanNumber(d.subscribers || d.Subscribers),
      views: cleanNumber(d.video_views || d["video views"] || d["Video Views"]),
            country: d.Country
        }))
    .filter(d => d.year >= 2005 && d.year <= 2023 && d.subs !== null && d.category && d.category !== "nan");

  const categories = Array.from(new Set(processedData.map(d => d.category))).sort();
    const years = d3.range(2005, 2024);

  
  const allCategoryCounts = d3.rollups(processedData, v => v.length, d => d.category)
    .sort((a, b) => b[1] - a[1]);
  
  const allCategoryNames = allCategoryCounts.map(d => d[0]);
  const scienceTechCategory = allCategoryNames.find(name => 
    name === "Science & Technology" || 
    name.toLowerCase().includes("science") && name.toLowerCase().includes("technology")
  );
  
  const importantCategories = ["Howto & Style", "Education", "Entertainment", "Music", "Gaming", "People & Blogs"];
  if (scienceTechCategory) {
    importantCategories.push(scienceTechCategory);
  }
  
  const importantInData = importantCategories.filter(cat => 
    allCategoryCounts.some(([name]) => name === cat)
  );
  
  const topByCount = allCategoryCounts
    .filter(([cat]) => !importantInData.includes(cat))
    .slice(0, Math.max(0, 10 - importantInData.length))
    .map(d => d[0]);
  
  const topCategories = [...importantInData, ...topByCount];
  
  const topCategoriesRadial = topCategories.slice(0, 8); 
  const topCategoriesNetwork = topCategories; 

  
  const allColors = [
    ...d3.schemeTableau10,
    ...d3.schemeSet3,
    ...d3.schemePaired,
    ...d3.schemeSet2,
    ...d3.schemeAccent
  ];
  const categoryColor = d3.scaleOrdinal()
        .domain(categories)
    .range(allColors);

  const eraColor = d3.scaleOrdinal()
    .domain(["Early Days", "Growth Era", "Modern Era", "Post-2020"])
    .range(["#3b82f6", "#10b981", "#f59e0b", "#ef4444"]);


    const svg = d3.create("svg")
        .attr("viewBox", [0, 0, CFG.W, CFG.H])
        .attr("width", CFG.W)
        .attr("height", CFG.H)
    .attr("style", `max-width: 100%; height: auto; display: block; font: ${CFG.FONT}; background: linear-gradient(to bottom, #f8fafc 0%, #f1f5f9 100%); color: #1a202c;`)
    .attr("role", "img")
    .attr("aria-label", "Evolution of YouTube Success");

  
  const titleGradient = svg.append("defs")
    .append("linearGradient")
    .attr("id", "titleGradient")
    .attr("x1", "0%").attr("y1", "0%")
    .attr("x2", "100%").attr("y2", "0%");
  titleGradient.append("stop").attr("offset", "0%").attr("stop-color", "#3b82f6");
  titleGradient.append("stop").attr("offset", "50%").attr("stop-color", "#10b981");
  titleGradient.append("stop").attr("offset", "100%").attr("stop-color", "#f59e0b");

  const title = svg.append("g").attr("transform", `translate(${CFG.PAD}, ${CFG.PAD})`);
  title.append("text")
    .attr("font-size", 44)
    .attr("font-weight", 800)
    .attr("fill", "url(#titleGradient)")
    .text("Q5: Evolution of YouTube Success (2005–2023)");
  title.append("text")
    .attr("y", 52)
    .attr("fill", "#64748b")
    .attr("font-size", 17)
    .text("Comprehensive multi-dimensional analysis: Hover/click any element to see coordinated highlighting across ALL visualizations");

  
  const highlightState = { 
    activeCategory: null, 
    activeYear: null, 
    activeEra: null,
    activeChannel: null,
    brushedYears: null
  };
  const subscribers = [];
  const subscribe = fn => subscribers.push(fn);
  const setActive = (type, value) => {
    if (type === "category") highlightState.activeCategory = value;
    if (type === "year") highlightState.activeYear = value;
    if (type === "era") highlightState.activeEra = value;
    if (type === "channel") highlightState.activeChannel = value;
    subscribers.forEach(fn => fn(highlightState));
  };
  const setBrushed = (years) => {
    highlightState.brushedYears = years;
    subscribers.forEach(fn => fn(highlightState));
  };
  const clearActive = () => {
    highlightState.activeCategory = null;
    highlightState.activeYear = null;
    highlightState.activeEra = null;
    highlightState.activeChannel = null;
    highlightState.brushedYears = null;
    subscribers.forEach(fn => fn(highlightState));
  };

  
  const buildTooltip = () => {
    const g = svg.append("g").style("pointer-events", "none").attr("opacity", 0);
    const bg = g.append("rect")
      .attr("fill", "rgba(255,255,255,0.98)")
      .attr("stroke", "#e2e8f0")
      .attr("stroke-width", 2)
      .attr("rx", 12)
      .attr("filter", "drop-shadow(0 8px 16px rgba(0,0,0,0.2))");
    const tx = g.append("text").attr("x", 16).attr("y", 24);
    tx.attr("font-size", 13);
    const show = (event, lines) => {
      const [mx, my] = d3.pointer(event, svg.node());
      tx.selectAll("tspan").remove();
      lines.forEach((line, i) => {
        const tspan = tx.append("tspan")
          .attr("x", 16)
          .attr("dy", i ? 22 : 0)
          .text(line);
        if (i === 0) tspan.attr("font-weight", 700).attr("fill", "#0f172a").attr("font-size", 15);
        else tspan.attr("fill", "#475569");
      });
      const bb = tx.node().getBBox();
      bg
        .attr("x", bb.x - 14)
        .attr("y", bb.y - 12)
        .attr("width", bb.width + 28)
        .attr("height", bb.height + 24);
      let x = mx + 30;
      let y = my - (bb.height + 40);
      x = Math.min(CFG.W - bb.width - 70, Math.max(25, x));
      y = Math.min(CFG.H - bb.height - 60, Math.max(35, y));
      g.attr("transform", `translate(${x}, ${y})`).attr("opacity", 1);
    };
    const hide = () => g.attr("opacity", 0);
    return { show, hide };
  };

  const tooltip = buildTooltip();

  
  const defs = svg.append("defs");
  const shadowFilter = defs.append("filter")
    .attr("id", "card-shadow")
    .attr("x", "-50%").attr("y", "-50%").attr("width", "200%").attr("height", "200%");
  shadowFilter.append("feGaussianBlur").attr("in", "SourceAlpha").attr("stdDeviation", 8);
  shadowFilter.append("feOffset").attr("dx", 0).attr("dy", 5).attr("result", "offsetblur");
  const feComponentTransfer = shadowFilter.append("feComponentTransfer");
  feComponentTransfer.append("feFuncA").attr("type", "linear").attr("slope", 0.35);
  const feMerge = shadowFilter.append("feMerge");
  feMerge.append("feMergeNode").attr("in", "offsetblur");
  feMerge.append("feMergeNode").attr("in", "SourceGraphic");

  const glowFilter = defs.append("filter")
    .attr("id", "glow")
    .attr("x", "-50%").attr("y", "-50%").attr("width", "200%").attr("height", "200%");
  glowFilter.append("feGaussianBlur").attr("stdDeviation", 5).attr("result", "coloredBlur");
  const feMergeGlow = glowFilter.append("feMerge");
  feMergeGlow.append("feMergeNode").attr("in", "coloredBlur");
  feMergeGlow.append("feMergeNode").attr("in", "SourceGraphic");

  const chartLayer = svg.append("g")
    .attr("transform", `translate(${CFG.PAD}, ${CFG.PAD + 140})`);

  const availableWidth = CFG.W - 2 * CFG.PAD;
  const availableHeight = CFG.H - CFG.PAD - 140 - CFG.PAD;

  
  const eras = [
    { label: "Early Days", start: 2005, end: 2010, color: "#3b82f6" },
    { label: "Growth Era", start: 2010, end: 2015, color: "#10b981" },
    { label: "Modern Era", start: 2015, end: 2020, color: "#f59e0b" },
    { label: "Post-2020", start: 2020, end: 2023, color: "#ef4444" }
  ];
  
  
  const cohorts = eras;

  
  const card1W = (availableWidth - CFG.GRID_GAP) / 2;
  const card1H = 700;
  const card1 = chartLayer.append("g").attr("transform", `translate(0, 0)`);
  
  card1.append("rect")
    .attr("width", card1W)
    .attr("height", card1H)
    .attr("fill", "#ffffff")
    .attr("stroke", "#e2e8f0")
    .attr("stroke-width", 2)
    .attr("rx", 18)
    .attr("filter", "url(#card-shadow)");

  card1.append("text")
    .attr("x", CFG.CARD_PAD)
    .attr("y", CFG.CARD_PAD + 28)
    .attr("font-size", 26)
        .attr("font-weight", 700)
        .attr("fill", "#0f172a")
    .text("1. Radial Timeline: Channel Creation Density");

  card1.append("text")
    .attr("x", CFG.CARD_PAD)
    .attr("y", CFG.CARD_PAD + 56)
        .attr("font-size", 14)
        .attr("fill", "#64748b")
    .text("When was the 'golden era'? Radial segments show category density by era");

  
  const eraSelectorY = CFG.CARD_PAD + 80;
  const eraButtonW = (card1W - CFG.CARD_PAD * 2 - 30) / eras.length;
  
  eras.forEach((era, i) => {
    const eraX = CFG.CARD_PAD + i * (eraButtonW + 10);
    const eraGroup = card1.append("g")
      .attr("transform", `translate(${eraX}, ${eraSelectorY})`)
      .style("cursor", "pointer")
      .on("click", () => {
        setActive("era", era.label);
        updateAllCharts();
      })
      .on("pointerenter", function() {
        d3.select(this).select("rect").attr("stroke-width", 4).attr("filter", "url(#glow)");
      })
      .on("pointerleave", function() {
        d3.select(this).select("rect").attr("stroke-width", 2).attr("filter", null);
      });

    eraGroup.append("rect")
      .attr("width", eraButtonW)
      .attr("height", 45)
      .attr("fill", era.color)
      .attr("fill-opacity", 0.15)
      .attr("stroke", era.color)
      .attr("stroke-width", 2)
      .attr("rx", 8);

    eraGroup.append("text")
      .attr("x", eraButtonW / 2)
      .attr("y", 28)
      .attr("text-anchor", "middle")
      .attr("font-size", 11)
      .attr("font-weight", 600)
      .attr("fill", era.color)
      .text(`${era.label}\n${era.start}-${era.end}`);

    const eraRect = eraGroup.select("rect");
    subscribe(state => {
      const isActive = state.activeEra === era.label;
      eraGroup.attr("opacity", !state.activeEra || isActive ? 1 : 0.4);
      if (isActive) {
        eraRect.attr("stroke-width", 4).attr("filter", "url(#glow)");
      } else {
        eraRect.attr("stroke-width", 2).attr("filter", null);
      }
    });
  });

  
  const radialCenterX = card1W / 2;
  const eraSelectorBottom = eraSelectorY + 45;
  const radialAvailableHeight = card1H - eraSelectorBottom - CFG.CARD_PAD - 60; 
  const maxRadius = Math.min(card1W / 2 - 100, radialAvailableHeight / 2 - 50); 
  const radialRadius = Math.max(100, maxRadius); 
  const radialCenterY = eraSelectorBottom + radialAvailableHeight / 2 + 20; 

  const radialData = eras.map(era => {
    const eraData = processedData.filter(d => d.year >= era.start && d.year < era.end);
    const byCategory = d3.rollups(eraData, v => v.length, d => d.category);
    const topCatData = topCategoriesRadial.map(cat => {
      const found = byCategory.find(d => d[0] === cat);
      return { category: cat, count: found ? found[1] : 0 };
    });
    return { ...era, data: topCatData, total: eraData.length };
  });

  const angleScale = d3.scalePoint()
    .domain(topCategoriesRadial)
    .range([0, 2 * Math.PI]);

  const radiusScale = d3.scaleSqrt()
    .domain([0, d3.max(radialData.flatMap(d => d.data.map(dd => dd.count)))])
    .range([0, radialRadius * 0.75]);

  const eraRingWidth = radialRadius / eras.length;
  
  eras.forEach((era, eraIdx) => {
    const angleStep = (2 * Math.PI) / topCategoriesRadial.length;
    const eraGroup = card1.append("g")
      .attr("class", `era-radial-${eraIdx}`)
      .attr("transform", `translate(${radialCenterX}, ${radialCenterY})`);

    const innerRadius = eraIdx * eraRingWidth;
    const outerRadius = (eraIdx + 1) * eraRingWidth;

    topCategoriesRadial.forEach((cat, catIdx) => {
      const count = radialData[eraIdx].data.find(d => d.category === cat)?.count || 0;
      const categoryRadius = innerRadius + (radiusScale(count) / radialRadius) * eraRingWidth;
      const angle = angleScale(cat);
      
      const points = [];
      for (let i = 0; i < 20; i++) {
        const a = angle - angleStep/2 + (i / 19) * angleStep;
        const r = Math.max(innerRadius, Math.min(outerRadius, categoryRadius));
        points.push([Math.cos(a) * r, Math.sin(a) * r]);
      }
      
      if (points.length > 0) {
        points.push([Math.cos(angle - angleStep/2) * innerRadius, Math.sin(angle - angleStep/2) * innerRadius]);
        points.push([Math.cos(angle + angleStep/2) * innerRadius, Math.sin(angle + angleStep/2) * innerRadius]);

        const polygon = eraGroup.append("polygon")
          .attr("points", points.map(p => p.join(",")).join(" "))
          .attr("fill", categoryColor(cat))
          .attr("fill-opacity", 0.5)
          .attr("stroke", categoryColor(cat))
          .attr("stroke-width", 2)
          .style("cursor", "pointer")
          .on("pointerenter", function(event) {
            setActive("category", cat);
            setActive("era", era.label);
            tooltip.show(event, [
              `${cat} · ${era.label}`,
              `Channels: ${count}`,
              `Period: ${era.start}-${era.end}`
            ]);
            d3.select(this).attr("fill-opacity", 0.9).attr("stroke-width", 4);
          })
          .on("pointerleave", function() {
            clearActive();
            tooltip.hide();
            d3.select(this).attr("fill-opacity", 0.5).attr("stroke-width", 2);
          });

        subscribe(state => {
          const categoryMatch = !state.activeCategory || state.activeCategory === cat;
          const eraMatch = !state.activeEra || state.activeEra === era.label;
          const yearMatch = !state.activeYear || (state.activeYear >= era.start && state.activeYear < era.end);
          const opacity = categoryMatch && eraMatch && yearMatch ? 1 : 0.15;
          polygon.attr("opacity", opacity);
          
          if (categoryMatch && eraMatch && yearMatch && (state.activeCategory === cat || state.activeEra === era.label)) {
            polygon.attr("fill-opacity", 0.9).attr("stroke-width", 4);
          } else {
            polygon.attr("fill-opacity", 0.5).attr("stroke-width", 2);
          }
        });
      }
    });

    const eraLabelRadius = radialRadius * 0.4;
    const eraLabelAngle = (eraIdx * 2 * Math.PI) / eras.length - Math.PI / 2;
    const eraLabelX = Math.cos(eraLabelAngle) * eraLabelRadius;
    const eraLabelY = Math.sin(eraLabelAngle) * eraLabelRadius;
    
    const eraLabel = eraGroup.append("text")
      .attr("x", eraLabelX)
      .attr("y", eraLabelY)
      .attr("text-anchor", "middle")
      .attr("font-size", 10)
      .attr("font-weight", 600)
      .attr("fill", era.color)
      .text(`${era.label}: ${radialData[eraIdx].total}`)
      .style("cursor", "pointer")
      .on("click", function() {
        setActive("era", era.label);
        d3.select(this).attr("font-weight", 700).attr("font-size", 11);
      })
      .on("pointerenter", function() {
        setActive("era", era.label);
        d3.select(this).attr("font-weight", 700).attr("font-size", 11);
      })
      .on("pointerleave", function() {
        if (!highlightState.activeEra || highlightState.activeEra !== era.label) {
          d3.select(this).attr("font-weight", 600).attr("font-size", 10);
        }
      });
    
    subscribe(state => {
      const eraMatch = !state.activeEra || state.activeEra === era.label;
      eraGroup.attr("opacity", eraMatch ? 1 : 0.3);
      eraLabel.attr("opacity", eraMatch ? 1 : 0.4);
    });
  });

  
  const categoryLabels = [];
  topCategoriesRadial.forEach((cat, i) => {
    const angle = angleScale(cat);
    const labelRadius = radialRadius + 50;
    const labelX = radialCenterX + Math.cos(angle) * labelRadius;
    const labelY = radialCenterY + Math.sin(angle) * labelRadius;
    
    const padding = 25;
    const clampedX = Math.max(padding, Math.min(card1W - padding, labelX));
    const clampedY = Math.max(eraSelectorBottom + padding, Math.min(card1H - padding, labelY));
    
    const labelText = card1.append("text")
      .attr("x", clampedX)
      .attr("y", clampedY)
      .attr("text-anchor", Math.abs(Math.cos(angle)) < 0.5 ? "middle" : (Math.cos(angle) > 0 ? "start" : "end"))
      .attr("font-size", 10)
      .attr("font-weight", 600)
      .attr("fill", "#475569")
      .text(cat.length > 15 ? cat.substring(0, 13) + "..." : cat)
      .style("cursor", "pointer")
      .on("pointerenter", function() {
        setActive("category", cat);
        d3.select(this).attr("font-weight", 700).attr("font-size", 11);
      })
      .on("pointerleave", function() {
        if (!highlightState.activeCategory || highlightState.activeCategory !== cat) {
          d3.select(this).attr("font-weight", 600).attr("font-size", 10);
        }
      });
    
    categoryLabels.push({ text: labelText, category: cat });
  });
  
  subscribe(state => {
    categoryLabels.forEach(({ text, category }) => {
      const categoryMatch = !state.activeCategory || state.activeCategory === category;
      text.attr("opacity", categoryMatch ? 1 : 0.4);
    });
  });

  
  const card2X = card1W + CFG.GRID_GAP;
  const card2 = chartLayer.append("g").attr("transform", `translate(${card2X}, 0)`);
  
  card2.append("rect")
    .attr("width", card1W)
    .attr("height", card1H)
    .attr("fill", "#ffffff")
    .attr("stroke", "#e2e8f0")
    .attr("stroke-width", 2)
    .attr("rx", 18)
    .attr("filter", "url(#card-shadow)");

  card2.append("text")
    .attr("x", CFG.CARD_PAD)
    .attr("y", CFG.CARD_PAD + 28)
    .attr("font-size", 26)
    .attr("font-weight", 700)
    .attr("fill", "#0f172a")
    .text("2. Network Evolution: Category Relationships");
  
  card2.append("text")
    .attr("x", CFG.CARD_PAD)
    .attr("y", CFG.CARD_PAD + 56)
    .attr("font-size", 14)
    .attr("fill", "#64748b")
    .text("Small multiples show network structure for each era. Link = similarity, size = channels");

  const networkW = card1W - CFG.CARD_PAD * 2;
  const NETWORK_TOP_PADDING = CFG.CARD_PAD + 60;
  const NETWORK_BOTTOM_PADDING = 40;
  const NETWORK_GAP = 25;
  const availableNetworkHeight =
    card1H - NETWORK_TOP_PADDING - NETWORK_BOTTOM_PADDING - (eras.length - 1) * NETWORK_GAP;
  const networkH = Math.max(130, availableNetworkHeight / eras.length);
  const networkX = CFG.CARD_PAD;
  
  
  eras.forEach((era, eraIdx) => {
    const networkY = NETWORK_TOP_PADDING + eraIdx * (networkH + NETWORK_GAP);
    
    const eraData = processedData.filter(d => d.year >= era.start && d.year < era.end);
    const categoryCounts = d3.rollups(eraData, v => v.length, d => d.category);
    const sortedCats = categoryCounts.sort((a, b) => b[1] - a[1]);
    const eraCatsMap = new Map(sortedCats);
    const allCategoryNames = Array.from(new Set(processedData.map(d => d.category)));
    
    const mustInclude = ["Howto & Style", "Education", "Entertainment", "Music", "Gaming", "People & Blogs"];
    const importantCats = mustInclude.filter(cat => allCategoryNames.includes(cat));
    const importantCatsInEra = importantCats.filter(cat => eraCatsMap.has(cat) && eraCatsMap.get(cat) > 0);
    
    const topCatsByCount = sortedCats
      .filter(([cat]) => !importantCatsInEra.includes(cat))
      .map(d => d[0]);
    
    const topCats = [...importantCatsInEra, ...topCatsByCount].slice(0, 10);
    
    
    const categoryYearDistributions = topCats.map(cat => {
      const catData = eraData.filter(d => d.category === cat);
      const yearDist = years.filter(y => y >= era.start && y < era.end)
        .map(year => catData.filter(d => d.year === year).length);
      return { category: cat, distribution: yearDist };
    });

    const cosineSimilarity = (a, b) => {
      let dotProduct = 0, normA = 0, normB = 0;
      for (let i = 0; i < a.length; i++) {
        dotProduct += a[i] * b[i];
        normA += a[i] * a[i];
        normB += b[i] * b[i];
      }
      return normA && normB ? dotProduct / (Math.sqrt(normA) * Math.sqrt(normB)) : 0;
    };

    const nodes = topCats.map(cat => ({
      id: cat,
      category: cat,
      total: eraData.filter(d => d.category === cat).length
    }));

    const links = [];
    for (let i = 0; i < categoryYearDistributions.length; i++) {
      for (let j = i + 1; j < categoryYearDistributions.length; j++) {
        const similarity = cosineSimilarity(
          categoryYearDistributions[i].distribution,
          categoryYearDistributions[j].distribution
        );
        if (similarity > 0.25) {
          links.push({
            source: categoryYearDistributions[i].category,
            target: categoryYearDistributions[j].category,
            value: similarity
          });
        }
      }
    }

    
    const nodeScale = d3.scaleSqrt()
      .domain([0, d3.max(nodes, d => d.total)])
      .range([8, 20]); 

    
    const padding = 50; 
    const nodeYCenter = networkH / 2;
    
    const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id(d => d.id).distance(d => 80 - d.value * 35).strength(0.5))
      .force("charge", d3.forceManyBody().strength(-400))
      .force("center", d3.forceCenter(networkW / 2, nodeYCenter))
      .force("collision", d3.forceCollide().radius(d => nodeScale(d.total) + 15))
      .force("x", d3.forceX(networkW / 2).strength(0.4))
      .force("y", d3.forceY(nodeYCenter).strength(0.5))
        .stop();

    
    for (let i = 0; i < 300; i++) {
      simulation.tick();

      nodes.forEach(node => {
        const r = nodeScale(node.total);
        node.x = Math.max(padding + r, Math.min(networkW - padding - r, node.x));
        node.y = Math.max(35 + r, Math.min(networkH - 30 - r, node.y));
      });
    }

    const networkGroup = card2.append("g")
      .attr("transform", `translate(${networkX}, ${networkY})`);

    
    networkGroup.append("text")
      .attr("x", networkW / 2)
      .attr("y", 18)
      .attr("text-anchor", "middle")
      .attr("font-size", 14)
      .attr("font-weight", 700)
      .attr("fill", era.color)
      .attr("stroke", "#ffffff")
      .attr("stroke-width", 0.5)
      .attr("paint-order", "stroke")
      .text(`${era.label} (${era.start}-${era.end})`);

    const maxLinkValue = d3.max(links, d => d.value);
    const linkScale = d3.scaleSqrt()
      .domain([0, maxLinkValue])
      .range([2, 20]);
    const opacityScale = d3.scaleLinear()
      .domain([0, maxLinkValue])
      .range([0.4, 0.9]);

    
    const linksSel = networkGroup.append("g")
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke", "#334155")
      .attr("stroke-width", d => linkScale(d.value))
      .attr("stroke-opacity", d => opacityScale(d.value))
      .attr("stroke-linecap", "round")
      .attr("x1", d => d.source.x)
      .attr("y1", d => d.source.y)
      .attr("x2", d => d.target.x)
      .attr("y2", d => d.target.y)
      .style("cursor", "pointer")
      .on("pointerenter", function(event, d) {
        setActive("category", d.source.id);
        setActive("era", era.label);
        d3.select(this).attr("stroke", era.color).attr("stroke-opacity", 1).attr("stroke-width", linkScale(d.value) + 4);
      })
      .on("pointerleave", function(event, d) {
        clearActive();
        d3.select(this).attr("stroke", "#334155").attr("stroke-opacity", opacityScale(d.value)).attr("stroke-width", linkScale(d.value));
      });

    
    const nodeGroup = networkGroup.append("g");
    nodeGroup.selectAll("circle")
      .data(nodes)
    .join("circle")
      .attr("r", d => nodeScale(d.total))
      .attr("fill", d => categoryColor(d.category))
      .attr("fill-opacity", 0.85)
      .attr("stroke", "#ffffff")
      .attr("stroke-width", 4)
    .attr("cx", d => d.x)
    .attr("cy", d => d.y)
      .style("cursor", "pointer")
      .on("pointerenter", function(event, d) {
        setActive("category", d.category);
        setActive("era", era.label);
        tooltip.show(event, [
          `${d.category} · ${era.label}`,
          `Channels: ${d.total}`,
          `Period: ${era.start}-${era.end}`
        ]);
        d3.select(this).attr("stroke-width", 6).attr("stroke", "#0f172a").attr("filter", "url(#glow)");
      })
      .on("pointerleave", function() {
        clearActive();
        tooltip.hide();
        d3.select(this).attr("stroke-width", 4).attr("stroke", "#ffffff").attr("filter", null);
      });

    nodeGroup.selectAll("text")
      .data(nodes)
      .join("text")
      .attr("x", d => Math.max(padding, Math.min(networkW - padding, d.x)))
      .attr("y", d => {
        const r = nodeScale(d.total);
        return Math.max(45 + r, Math.min(networkH - 20, d.y + r + 10));
      })
      .attr("text-anchor", "middle")
      .attr("font-size", 8)
      .attr("font-weight", 600)
      .attr("fill", "#1e293b")
      .attr("pointer-events", "none")
      .text(d => {
        const maxLen = 9;
        return d.category.length > maxLen ? d.category.substring(0, maxLen - 2) + ".." : d.category;
      });

    subscribe(state => {
      const eraMatch = !state.activeEra || state.activeEra === era.label;
      const yearMatch = !state.activeYear || (state.activeYear >= era.start && state.activeYear < era.end);
      nodeGroup.selectAll("circle").attr("opacity", d => {
        const categoryMatch = !state.activeCategory || state.activeCategory === d.category;
        return categoryMatch && eraMatch && yearMatch ? 1 : 0.2;
      });
      linksSel
        .attr("opacity", d => {
          const catMatch = !state.activeCategory || state.activeCategory === d.source.id || state.activeCategory === d.target.id;
          return catMatch && eraMatch && yearMatch ? 0.8 : 0.15;
        })
        .attr("stroke", d => {
          const catMatch = state.activeCategory && (state.activeCategory === d.source.id || state.activeCategory === d.target.id);
          return catMatch ? era.color : "#cbd5e1";
        });
    });
  });

  
  const card3Y = card1H + CFG.GRID_GAP;
  const card3W = (availableWidth - CFG.GRID_GAP) / 2;
  const card3H = 750;
  
  const card3 = chartLayer.append("g").attr("transform", `translate(0, ${card3Y})`);
  
  card3.append("rect")
    .attr("width", card3W)
    .attr("height", card3H)
    .attr("fill", "#ffffff")
    .attr("stroke", "#e2e8f0")
    .attr("stroke-width", 2)
    .attr("rx", 18)
    .attr("filter", "url(#card-shadow)");

  card3.append("text")
    .attr("x", CFG.CARD_PAD)
    .attr("y", CFG.CARD_PAD + 28)
    .attr("font-size", 24)
    .attr("font-weight", 700)
    .attr("fill", "#0f172a")
    .text("3. Parallel Coordinates: Multi-dimensional Patterns");
  
  card3.append("text")
    .attr("x", CFG.CARD_PAD)
    .attr("y", CFG.CARD_PAD + 50)
    .attr("font-size", 11)
    .attr("fill", "#64748b")
    .text("Compare categories across dimensions. Brush to filter");

  const parallelW = card3W - CFG.CARD_PAD * 2;
  const parallelH = card3H - CFG.CARD_PAD * 2 - 110;
  const parallelX = CFG.CARD_PAD;
  const parallelY = CFG.CARD_PAD + 105;

  
  const parallelData = topCategories.map(cat => {
    const catData = processedData.filter(d => d.category === cat);
    return {
      category: cat,
      avgSubs: d3.mean(catData, d => d.subs),
      totalChannels: catData.length,
      avgYear: d3.mean(catData, d => d.year),
      avgViews: d3.mean(catData, d => d.views),
      peakYear: d3.max(catData, d => d.year),
      earlyAdopter: catData.filter(d => d.year < 2010).length / catData.length
    };
  });

  const dimensions = [
    { name: "Avg Subs", accessor: d => d.avgSubs, format: d => d3.format(".2s")(d) },
    { name: "Total Channels", accessor: d => d.totalChannels, format: d => d3.format(",")(d) },
    { name: "Avg Year", accessor: d => d.avgYear, format: d => Math.round(d) },
    { name: "Early Adopter %", accessor: d => d.earlyAdopter, format: d => d3.format(".0%")(d) }
];

  const xScale = d3.scalePoint()
    .domain(dimensions.map(d => d.name))
    .range([parallelX, parallelX + parallelW])
    .padding(0.2);

  const yScales = {};
  dimensions.forEach(dim => {
    const values = parallelData.map(dim.accessor);
    yScales[dim.name] = d3.scaleLinear()
      .domain(d3.extent(values))
      .range([parallelY + parallelH, parallelY])
      .nice();
  });

  
  dimensions.forEach(dim => {
    const x = xScale(dim.name);
    
    
    card3.append("line")
      .attr("x1", x)
      .attr("x2", x)
      .attr("y1", parallelY)
      .attr("y2", parallelY + parallelH)
      .attr("stroke", "#334155")
      .attr("stroke-width", 2);

    
    card3.append("text")
      .attr("x", x)
      .attr("y", parallelY - 30)
    .attr("text-anchor", "middle")
      .attr("font-size", 11)
      .attr("font-weight", 600)
      .attr("fill", "#0f172a")
      .text(dim.name.length > 18 ? dim.name.substring(0, 16) + "..." : dim.name);

    
    const ticks = yScales[dim.name].ticks(5);
    ticks.forEach(tick => {
      card3.append("line")
        .attr("x1", x - 5)
        .attr("x2", x + 5)
        .attr("y1", yScales[dim.name](tick))
        .attr("y2", yScales[dim.name](tick))
        .attr("stroke", "#94a3b8")
        .attr("stroke-width", 1);

      card3.append("text")
        .attr("x", x - 8)
        .attr("y", yScales[dim.name](tick))
        .attr("text-anchor", "end")
        .attr("font-size", 9)
        .attr("fill", "#64748b")
        .text(dim.format(tick));
    });
  });

  
  const line = d3.line()
    .x((d, i) => xScale(dimensions[i].name))
    .y((d, i) => yScales[dimensions[i].name](d));

  parallelData.forEach(d => {
    const values = dimensions.map(dim => dim.accessor(d));
    const path = card3.append("path")
      .datum(values)
      .attr("d", line)
      .attr("fill", "none")
      .attr("stroke", categoryColor(d.category))
      .attr("stroke-width", 2.5)
      .attr("stroke-opacity", 0.7)
      .style("cursor", "pointer")
      .on("pointerenter", function(event) {
        setActive("category", d.category);
        tooltip.show(event, [
          d.category,
          `Avg Subs: ${d3.format(".2s")(d.avgSubs)}`,
          `Channels: ${d.totalChannels}`,
          `Avg Year: ${Math.round(d.avgYear)}`,
          `Early Adopter: ${d3.format(".0%")(d.earlyAdopter)}`
        ]);
        d3.select(this).attr("stroke-width", 4).attr("stroke-opacity", 1).attr("filter", "url(#glow)");
      })
      .on("pointerleave", function() {
        clearActive();
        tooltip.hide();
        d3.select(this).attr("stroke-width", 2.5).attr("stroke-opacity", 0.7).attr("filter", null);
      });

    subscribe(state => {
      const categoryMatch = !state.activeCategory || state.activeCategory === d.category;
      const yearMatch = !state.activeYear || (d.avgYear >= state.activeYear - 2 && d.avgYear <= state.activeYear + 2);
      path.attr("opacity", categoryMatch && yearMatch ? 1 : 0.15);
    });
  });

  
  const card4X = card3W + CFG.GRID_GAP;
  const card4 = chartLayer.append("g").attr("transform", `translate(${card4X}, ${card3Y})`);
  
  card4.append("rect")
    .attr("width", card3W)
    .attr("height", card3H)
    .attr("fill", "#ffffff")
    .attr("stroke", "#e2e8f0")
    .attr("stroke-width", 2)
    .attr("rx", 18)
    .attr("filter", "url(#card-shadow)");

  card4.append("text")
    .attr("x", CFG.CARD_PAD)
    .attr("y", CFG.CARD_PAD + 28)
    .attr("font-size", 26)
    .attr("font-weight", 700)
    .attr("fill", "#0f172a")
    .text("4. Success Heatmap: Year × Category Matrix");
  
  card4.append("text")
    .attr("x", CFG.CARD_PAD)
    .attr("y", CFG.CARD_PAD + 56)
    .attr("font-size", 14)
    .attr("fill", "#64748b")
    .text("Which year-category combinations produced the most successful channels? Color = avg subscribers");

  const heatmapW = card3W - CFG.CARD_PAD * 2 - 100;
  const heatmapH = card3H - CFG.CARD_PAD * 2 - 100;
  const heatmapX = CFG.CARD_PAD + 80;
  const heatmapY = CFG.CARD_PAD + 80;

  
  const heatmapData = [];
  topCategories.forEach(cat => {
    years.forEach(year => {
      const yearData = processedData.filter(d => d.category === cat && d.year === year);
      const avgSubs = yearData.length ? d3.mean(yearData, d => d.subs) : 0;
      const count = yearData.length;
      heatmapData.push({ category: cat, year, avgSubs, count });
    });
  });

  const colorScaleHeatmap = d3.scaleSequential(d3.interpolateYlOrRd)
    .domain([0, d3.max(heatmapData, d => d.avgSubs)]);

  
  const scaleXHeatmap = d3.scaleBand()
    .domain(years)
    .range([heatmapX, heatmapX + heatmapW])
    .padding(0.03);

  const scaleYHeatmap = d3.scaleBand()
    .domain(topCategories)
    .range([heatmapY, heatmapY + heatmapH])
    .padding(0.05);

  
  heatmapData.forEach(d => {
    const cell = card4.append("rect")
      .attr("x", scaleXHeatmap(d.year))
      .attr("y", scaleYHeatmap(d.category))
      .attr("width", scaleXHeatmap.bandwidth())
      .attr("height", scaleYHeatmap.bandwidth())
      .attr("fill", d.avgSubs > 0 ? colorScaleHeatmap(d.avgSubs) : "#f1f5f9")
      .attr("stroke", "#ffffff")
      .attr("stroke-width", 1.5)
      .attr("rx", 3)
      .style("cursor", "pointer")
      .on("pointerenter", function(event) {
        setActive("category", d.category);
        setActive("year", d.year);
        tooltip.show(event, [
          `${d.category} · ${d.year}`,
          `Avg Subscribers: ${d3.format(".2s")(d.avgSubs)}`,
          `Channels Created: ${d.count}`
        ]);
        d3.select(this).attr("stroke-width", 4).attr("stroke", "#0f172a");
      })
      .on("pointerleave", function() {
        clearActive();
        tooltip.hide();
        d3.select(this).attr("stroke-width", 1.5).attr("stroke", "#ffffff");
      });

    subscribe(state => {
      cell.attr("opacity", 
        (!state.activeCategory || state.activeCategory === d.category) &&
        (!state.activeYear || state.activeYear === d.year) ? 1 : 0.25
      );
    });
  });

  
  card4.append("g")
    .attr("transform", `translate(0, ${heatmapY + heatmapH})`)
    .call(d3.axisBottom(scaleXHeatmap)
      .tickFormat((d, i) => i % 2 === 0 ? d3.format("d")(d) : "")
      .tickSize(5))
    .call(g => g.selectAll("text")
      .attr("font-size", 8)
      .attr("fill", AXIS_CONFIG.tickFill)
      .attr("transform", "rotate(-45)")
      .attr("text-anchor", "end")
      .attr("dx", "-0.5em")
      .attr("dy", "0.5em"))
    .call(g => g.selectAll(".tick line")
      .attr("stroke", AXIS_CONFIG.gridColor)
      .attr("stroke-width", AXIS_CONFIG.gridWidth))
    .call(g => g.select(".domain")
      .attr("stroke", AXIS_CONFIG.domainColor)
      .attr("stroke-width", AXIS_CONFIG.domainWidth));

  card4.append("text")
    .attr("x", heatmapX + heatmapW / 2)
    .attr("y", heatmapY + heatmapH + 50)
    .attr("text-anchor", "middle")
    .attr("fill", AXIS_CONFIG.labelFill)
    .attr("font-size", AXIS_CONFIG.labelFontSize)
    .attr("font-weight", AXIS_CONFIG.labelFontWeight)
    .text("Creation Year");

  
  card4.append("g")
    .attr("transform", `translate(${heatmapX}, 0)`)
    .call(d3.axisLeft(scaleYHeatmap))
    .call(g => g.selectAll("text")
      .attr("font-size", 11)
      .attr("fill", AXIS_CONFIG.tickFill))
    .call(g => g.select(".domain")
      .attr("stroke", AXIS_CONFIG.domainColor)
      .attr("stroke-width", AXIS_CONFIG.domainWidth));

  
  const legendWidth = 18;
  const legendHeight = 150;
  const legendX = card3W - CFG.CARD_PAD - legendWidth - 5;
  const legendY = CFG.CARD_PAD + 5;
  const legendHeatmap = card4.append("g")
    .attr("transform", `translate(${legendX}, ${legendY})`);
  const legendGradient = defs.append("linearGradient")
    .attr("id", "heatmapGradient")
    .attr("x1", "0%").attr("y1", "100%")
    .attr("x2", "0%").attr("y2", "0%");

  for (let i = 0; i <= 10; i++) {
    const t = i / 10;
    legendGradient.append("stop")
      .attr("offset", `${t * 100}%`)
      .attr("stop-color", colorScaleHeatmap(d3.max(heatmapData, d => d.avgSubs) * t));
  }

  legendHeatmap.append("rect")
    .attr("width", legendWidth)
    .attr("height", legendHeight)
    .attr("fill", "url(#heatmapGradient)")
    .attr("stroke", "#cbd5e1")
    .attr("stroke-width", 1.5);

  legendHeatmap.append("text")
    .attr("x", legendWidth + 8)
    .attr("y", 8)
    .attr("text-anchor", "start")
    .attr("font-size", 9)
    .attr("font-weight", 600)
    .attr("fill", "#475569")
    .text("High");

  legendHeatmap.append("text")
    .attr("x", legendWidth / 2)
    .attr("y", -12)
    .attr("text-anchor", "middle")
    .attr("font-size", 9)
    .attr("font-weight", 600)
    .attr("fill", "#475569")
    .text("Avg Subs");

  legendHeatmap.append("text")
    .attr("x", legendWidth + 8)
    .attr("y", legendHeight - 4)
    .attr("text-anchor", "start")
    .attr("font-size", 9)
    .attr("fill", "#64748b")
    .text("Low");

  
  const card5Y = card3Y + card3H + CFG.GRID_GAP;
  const card5W = availableWidth;
  const card5H = 600;
  
  const card5 = chartLayer.append("g").attr("transform", `translate(0, ${card5Y})`);
  
  card5.append("rect")
    .attr("width", card5W)
    .attr("height", card5H)
    .attr("fill", "#ffffff")
    .attr("stroke", "#e2e8f0")
    .attr("stroke-width", 2)
    .attr("rx", 18)
    .attr("filter", "url(#card-shadow)");

  card5.append("text")
    .attr("x", CFG.CARD_PAD)
    .attr("y", CFG.CARD_PAD + 28)
    .attr("font-size", 26)
    .attr("font-weight", 700)
    .attr("fill", "#0f172a")
    .text("5. Stream Graph: Category Dominance Evolution (2005-2023)");
  
  card5.append("text")
    .attr("x", CFG.CARD_PAD)
    .attr("y", CFG.CARD_PAD + 56)
    .attr("font-size", 14)
    .attr("fill", "#64748b")
    .text("How did category popularity shift? Width = channel count. Hover to highlight across ALL charts");

  const streamW = card5W - CFG.CARD_PAD * 2 - 120;
  const streamH = card5H - CFG.CARD_PAD * 2 - 120;
  const streamX = CFG.CARD_PAD + 100;
  const streamY = CFG.CARD_PAD + 80;

  
  const streamData = years.map(year => {
    const counts = {};
    topCategories.forEach(cat => {
      counts[cat] = processedData.filter(d => d.category === cat && d.year === year).length;
    });
    return { year, ...counts };
  });

  const stack = d3.stack()
    .keys(topCategories)
    .order(d3.stackOrderNone)
    .offset(d3.stackOffsetWiggle);

  const stacked = stack(streamData);

  const scaleXStream = d3.scaleLinear()
    .domain([2005, 2023])
    .range([streamX, streamX + streamW]);

  const scaleYStream = d3.scaleLinear()
    .domain([d3.min(stacked, d => d3.min(d, d => d[0])), d3.max(stacked, d => d3.max(d, d => d[1]))])
    .range([streamY + streamH, streamY]);

  const area = d3.area()
    .x(d => scaleXStream(d.data.year))
    .y0(d => scaleYStream(d[0]))
    .y1(d => scaleYStream(d[1]))
    .curve(d3.curveBasis);

  
  const streamPaths = card5.append("g")
    .selectAll("path")
    .data(stacked)
    .join("path")
    .attr("d", area)
    .attr("fill", d => categoryColor(d.key))
    .attr("fill-opacity", 0.75)
    .attr("stroke", "#ffffff")
    .attr("stroke-width", 2.5)
    .attr("data-category", d => d.key)
    .style("cursor", "pointer")
    .on("pointerenter", function(event, d) {
      setActive("category", d.key);
      const total = d3.sum(d, dd => dd.data[d.key]);
      
      const yearCounts = d.map(dd => ({ year: dd.data.year, count: dd.data[d.key] }));
      const maxCount = d3.max(yearCounts, yc => yc.count);
      const peakYear = yearCounts.find(yc => yc.count === maxCount)?.year || "N/A";
      tooltip.show(event, [
        d.key,
        `Total channels: ${total}`,
        `Peak year: ${peakYear}`,
        `Avg per year: ${Math.round(total / years.length)}`
      ]);
      d3.select(this).attr("fill-opacity", 1).attr("stroke-width", 4).attr("filter", "url(#glow)");
    })
    .on("pointerleave", function() {
      clearActive();
      tooltip.hide();
      d3.select(this).attr("fill-opacity", 0.75).attr("stroke-width", 2.5).attr("filter", null);
    })
    .on("mousemove", function(event) {
      const [mx] = d3.pointer(event, card5.node());
      const year = Math.round(scaleXStream.invert(mx));
      const clampedYear = Math.max(2005, Math.min(2023, year));
      if (clampedYear >= 2005 && clampedYear <= 2023) {
        setActive("year", clampedYear);
      }
    });

  
  const streamOverlay = card5.append("rect")
    .attr("x", streamX)
    .attr("y", streamY)
    .attr("width", streamW)
    .attr("height", streamH)
    .attr("fill", "transparent")
    .style("cursor", "crosshair")
    .on("mousemove", function(event) {
      const [mx] = d3.pointer(event, card5.node());
      const year = Math.round(scaleXStream.invert(mx));
      const clampedYear = Math.max(2005, Math.min(2023, year));
      if (clampedYear >= 2005 && clampedYear <= 2023) {
        setActive("year", clampedYear);
      }
    })
    .on("mouseleave", function() {
      setActive("year", null);
    });

  
  const yearLine = card5.append("line")
    .attr("x1", scaleXStream(2014))
    .attr("x2", scaleXStream(2014))
    .attr("y1", streamY)
    .attr("y2", streamY + streamH)
    .attr("stroke", "#ef4444")
    .attr("stroke-width", 3)
    .attr("stroke-dasharray", "5,5")
    .attr("opacity", 0)
    .style("pointer-events", "none");

  subscribe(state => {
    streamPaths.attr("opacity", d => {
      const categoryMatch = !state.activeCategory || state.activeCategory === d.key;
      const yearMatch = !state.activeYear || d.some(dd => dd.data.year === state.activeYear);
      return categoryMatch && yearMatch ? 1 : 0.2;
    });
    
    
    if (state.activeYear) {
      yearLine
        .attr("x1", scaleXStream(state.activeYear))
        .attr("x2", scaleXStream(state.activeYear))
        .attr("opacity", 0.6);
    } else {
      yearLine.attr("opacity", 0);
    }
  });

  
  const xAxisStream = d3.axisBottom(scaleXStream)
    .tickFormat(d3.format("d"))
    .ticks(10)
    .tickSizeInner(-streamH)
    .tickSizeOuter(6);

  card5.append("g")
    .attr("transform", `translate(0, ${streamY + streamH})`)
    .call(xAxisStream)
    .call(g => g.selectAll("text")
      .attr("font-size", AXIS_CONFIG.tickFontSize)
      .attr("fill", AXIS_CONFIG.tickFill))
    .call(g => g.selectAll(".tick line")
      .attr("stroke", AXIS_CONFIG.gridColor)
      .attr("stroke-width", AXIS_CONFIG.gridWidth))
    .call(g => g.select(".domain")
      .attr("stroke", AXIS_CONFIG.domainColor)
      .attr("stroke-width", AXIS_CONFIG.domainWidth));

  card5.append("text")
    .attr("x", streamX + streamW / 2)
    .attr("y", streamY + streamH + 45)
    .attr("text-anchor", "middle")
    .attr("fill", AXIS_CONFIG.labelFill)
    .attr("font-size", AXIS_CONFIG.labelFontSize)
    .attr("font-weight", AXIS_CONFIG.labelFontWeight)
    .text("Year");

  
  const legendWidthStream = 160;
  const legendHeightStream = topCategories.length * 22 + 20;
  const legendXStream = card5W - CFG.CARD_PAD - legendWidthStream - 5;
  const legendYStream = CFG.CARD_PAD + 5;

  const streamLegend = card5.append("g")
    .attr("transform", `translate(${legendXStream}, ${legendYStream})`);
  
  streamLegend.append("rect")
    .attr("x", -10)
    .attr("y", -10)
    .attr("width", legendWidthStream + 20)
    .attr("height", legendHeightStream + 20)
    .attr("fill", "rgba(255,255,255,0.88)")
    .attr("stroke", "#e2e8f0")
    .attr("stroke-width", 1.5)
    .attr("rx", 8);
  
  topCategories.forEach((cat, i) => {
    const g = streamLegend.append("g")
      .attr("transform", `translate(0, ${i * 22})`)
      .style("cursor", "pointer")
      .on("pointerenter", () => setActive("category", cat))
      .on("pointerleave", () => clearActive());
    
    g.append("rect")
      .attr("width", 16)
      .attr("height", 16)
      .attr("fill", categoryColor(cat))
      .attr("rx", 3)
      .attr("stroke", "#ffffff")
      .attr("stroke-width", 1.5);
    
    g.append("text")
      .attr("x", 20)
      .attr("y", 12)
      .attr("font-size", 10)
      .attr("fill", "#475569")
      .text(cat.length > 15 ? cat.substring(0, 13) + "..." : cat);

    subscribe(state => {
      g.attr("opacity", !state.activeCategory || state.activeCategory === cat ? 1 : 0.3);
    });
  });

  
  const card6Y = card5Y + card5H + CFG.GRID_GAP;
  const card6H = 700;
  
  const card6 = chartLayer.append("g").attr("transform", `translate(0, ${card6Y})`);
  
  card6.append("rect")
    .attr("width", availableWidth)
    .attr("height", card6H)
    .attr("fill", "#ffffff")
    .attr("stroke", "#e2e8f0")
    .attr("stroke-width", 2)
    .attr("rx", 18)
    .attr("filter", "url(#card-shadow)");

  card6.append("text")
    .attr("x", CFG.CARD_PAD)
    .attr("y", CFG.CARD_PAD + 28)
    .attr("font-size", 26)
    .attr("font-weight", 700)
    .attr("fill", "#0f172a")
    .text("6. Cohort Analysis & Growth Rates: Do Early Adopters Still Dominate?");
  
  card6.append("text")
    .attr("x", CFG.CARD_PAD)
    .attr("y", CFG.CARD_PAD + 56)
    .attr("font-size", 14)
    .attr("fill", "#64748b")
    .text("Left: Cumulative channels by cohort. Right: Subscriber distribution by era (box plots). All linked!");

  const cohortW = (availableWidth - CFG.CARD_PAD * 2 - CFG.GRID_GAP) / 2;
  const cohortH = card6H - CFG.CARD_PAD * 2 - 100;
  const cohortX = CFG.CARD_PAD;
  const cohortY = CFG.CARD_PAD + 80;

  

  const cohortData = cohorts.map(cohort => {
    const cohortChannels = processedData.filter(d => d.year >= cohort.start && d.year < cohort.end);
    return {
      ...cohort,
      cumulative: years.map(year => {
        const count = cohortChannels.filter(d => d.year <= year).length;
        return { year, count };
      })
    };
  });

  const scaleXCohort = d3.scaleLinear()
    .domain([2005, 2023])
    .range([cohortX + 60, cohortX + cohortW - 20]);

  const maxCount = d3.max(cohortData, d => d3.max(d.cumulative, dd => dd.count));
  const scaleYCohort = d3.scaleLinear()
    .domain([0, maxCount])
    .range([cohortY + cohortH - 50, cohortY + 20])
    .nice();

  
  const lineCohort = d3.line()
    .x(d => scaleXCohort(d.year))
    .y(d => scaleYCohort(d.count))
    .curve(d3.curveMonotoneX);

  const cohortOverlay = card6.append("rect")
    .attr("x", cohortX + 60)
    .attr("y", cohortY + 20)
    .attr("width", cohortW - 80)
    .attr("height", cohortH - 70)
    .attr("fill", "transparent")
    .style("cursor", "crosshair")
    .style("pointer-events", "all")
    .lower()
    .on("click", function(event) {
      const [mx] = d3.pointer(event, card6.node());
      const year = Math.round(scaleXCohort.invert(mx - cohortX - 60));
      const clampedYear = Math.max(2005, Math.min(2023, year));
      if (clampedYear >= 2005 && clampedYear <= 2023) {
        setActive("year", clampedYear);
      }
    });

  const cohortPaths = [];
  cohortData.forEach(cohort => {
    const path = card6.append("path")
      .datum(cohort.cumulative)
      .attr("d", lineCohort)
      .attr("fill", "none")
      .attr("stroke", cohort.color)
      .attr("stroke-width", 4)
      .attr("stroke-opacity", 0.8)
      .attr("data-era", cohort.label) 
      .style("cursor", "pointer")
      .on("click", function(event) {
        setActive("era", cohort.label);
        d3.select(this).attr("stroke-width", 6).attr("stroke-opacity", 1).attr("filter", "url(#glow)");
        const last = cohort.cumulative[cohort.cumulative.length - 1];
        tooltip.show(event, [
          `Cohort: ${cohort.label}`,
          `Total channels: ${last.count}`,
          `Period: ${cohort.start}-${cohort.end}`
        ]);
      })
      .on("pointerenter", function(event) {
        setActive("era", cohort.label);
        d3.select(this).attr("stroke-width", 6).attr("stroke-opacity", 1).attr("filter", "url(#glow)");
        const last = cohort.cumulative[cohort.cumulative.length - 1];
        tooltip.show(event, [
          `Cohort: ${cohort.label}`,
          `Total channels: ${last.count}`,
          `Period: ${cohort.start}-${cohort.end}`
        ]);
      })
      .on("pointerleave", function() {
        if (!highlightState.activeEra || highlightState.activeEra !== cohort.label) {
          tooltip.hide();
          d3.select(this).attr("stroke-width", 4).attr("stroke-opacity", 0.8).attr("filter", null);
        }
      });
    cohortPaths.push({ path, era: cohort.label });
  });

  
  const cohortYearLine = card6.append("line")
    .attr("x1", scaleXCohort(2014))
    .attr("x2", scaleXCohort(2014))
    .attr("y1", cohortY + 20)
    .attr("y2", cohortY + cohortH - 50)
    .attr("stroke", "#ef4444")
    .attr("stroke-width", 3)
    .attr("stroke-dasharray", "5,5")
    .attr("opacity", 0)
    .style("pointer-events", "none");

  subscribe(state => {
    cohortPaths.forEach(({ path, era }) => {
      const eraObj = eras.find(e => e.label === era);
      const eraMatch = !state.activeEra || state.activeEra === era;
      const yearMatch = !state.activeYear || (state.activeYear >= eraObj.start && state.activeYear < eraObj.end);
      const categoryMatch = !state.activeCategory || true;
      const opacity = eraMatch && yearMatch && categoryMatch ? 1 : 0.3;
      const strokeWidth = eraMatch && yearMatch && categoryMatch && state.activeEra === era ? 6 : 4;
      path.attr("opacity", opacity)
          .attr("stroke-width", strokeWidth)
          .attr("stroke-opacity", opacity === 1 ? 1 : 0.8);
    });
    
    if (state.activeYear) {
      cohortYearLine
        .attr("x1", scaleXCohort(state.activeYear))
        .attr("x2", scaleXCohort(state.activeYear))
        .attr("opacity", 0.6);
    } else {
      cohortYearLine.attr("opacity", 0);
    }
  });

  
  card6.append("g")
    .attr("transform", `translate(0, ${cohortY + cohortH - 50})`)
    .call(d3.axisBottom(scaleXCohort)
      .tickFormat(d3.format("d"))
      .tickValues(years.filter(y => y % 3 === 0)))
    .call(g => g.selectAll("text")
      .attr("font-size", 9)
      .attr("fill", AXIS_CONFIG.tickFill)
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em"))
    .call(g => g.selectAll(".tick line")
      .attr("stroke", "#e2e8f0")
      .attr("stroke-width", 1))
    .call(g => g.select(".domain")
      .attr("stroke", AXIS_CONFIG.domainColor)
      .attr("stroke-width", AXIS_CONFIG.domainWidth));

  card6.append("text")
    .attr("x", cohortX + cohortW / 2)
    .attr("y", cohortY + cohortH - 15)
    .attr("text-anchor", "middle")
    .attr("fill", AXIS_CONFIG.labelFill)
    .attr("font-size", 11)
    .attr("font-weight", 600)
    .text("Year");

  
  card6.append("g")
    .attr("transform", `translate(${cohortX + 60}, 0)`)
    .call(d3.axisLeft(scaleYCohort).ticks(6))
    .call(g => g.selectAll("text")
      .attr("font-size", AXIS_CONFIG.tickFontSize)
      .attr("fill", AXIS_CONFIG.tickFill))
    .call(g => g.select(".domain")
      .attr("stroke", AXIS_CONFIG.domainColor)
      .attr("stroke-width", AXIS_CONFIG.domainWidth));

  card6.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -(cohortY + cohortH / 2))
    .attr("y", cohortX + 30)
    .attr("text-anchor", "middle")
    .attr("fill", AXIS_CONFIG.labelFill)
    .attr("font-size", AXIS_CONFIG.labelFontSize)
    .attr("font-weight", AXIS_CONFIG.labelFontWeight)
    .text("Cumulative Channels");

  
  const boxX = cohortX + cohortW + CFG.GRID_GAP;
  const boxW = cohortW;
  const boxH = cohortH;
  const boxY = cohortY;

  const eraData = eras.map(era => ({
    era: era.label,
    color: era.color,
    data: processedData.filter(d => d.year >= era.start && d.year < era.end)
  }));

  const scaleXBox = d3.scaleBand()
    .domain(eras.map(e => e.label))
    .range([boxX + 60, boxX + boxW - 20])
    .padding(0.4);

  const scaleYBox = d3.scaleLog()
    .domain([1e6, d3.max(processedData, d => d.subs)])
    .range([boxY + boxH - 40, boxY + 20])
    .nice();

  
  const boxPlotElements = [];
  
  
  eraData.forEach((era, i) => {
    const x = scaleXBox(era.era);
    const width = scaleXBox.bandwidth();
    const subs = era.data.map(d => d.subs).sort(d3.ascending);
    
    if (subs.length === 0) return;

    const q1 = d3.quantile(subs, 0.25);
    const median = d3.quantile(subs, 0.5);
    const q3 = d3.quantile(subs, 0.75);
    const iqr = q3 - q1;
    const min = Math.max(subs[0], q1 - 1.5 * iqr);
    const max = Math.min(subs[subs.length - 1], q3 + 1.5 * iqr);

    
    const boxRect = card6.append("rect")
      .attr("x", x - width/4)
      .attr("y", scaleYBox(q3))
      .attr("width", width/2)
      .attr("height", scaleYBox(q1) - scaleYBox(q3))
      .attr("fill", era.color)
      .attr("fill-opacity", 0.3)
      .attr("stroke", era.color)
      .attr("stroke-width", 2.5)
      .attr("data-era", era.era)
      .style("cursor", "pointer")
      .on("click", function() {
        setActive("era", era.era);
        d3.select(this).attr("fill-opacity", 0.5).attr("stroke-width", 4);
      })
      .on("pointerenter", function() {
        setActive("era", era.era);
        d3.select(this).attr("fill-opacity", 0.5).attr("stroke-width", 4);
      })
      .on("pointerleave", function() {
        if (!highlightState.activeEra || highlightState.activeEra !== era.era) {
          d3.select(this).attr("fill-opacity", 0.3).attr("stroke-width", 2.5);
        }
      });

    
    const medianLine = card6.append("line")
      .attr("x1", x - width/4)
      .attr("x2", x + width/4)
      .attr("y1", scaleYBox(median))
      .attr("y2", scaleYBox(median))
      .attr("stroke", era.color)
      .attr("stroke-width", 3)
      .attr("data-era", era.era);

    
    const whisker1 = card6.append("line")
      .attr("x1", x)
      .attr("x2", x)
      .attr("y1", scaleYBox(min))
      .attr("y2", scaleYBox(q1))
      .attr("stroke", era.color)
      .attr("stroke-width", 2.5)
      .attr("data-era", era.era);
    
    const whisker2 = card6.append("line")
      .attr("x1", x)
      .attr("x2", x)
      .attr("y1", scaleYBox(q3))
      .attr("y2", scaleYBox(max))
      .attr("stroke", era.color)
      .attr("stroke-width", 2.5)
      .attr("data-era", era.era);

    
    const outliers = subs.filter(d => d < min || d > max).slice(0, 30);
    const outlierGroup = card6.append("g")
      .attr("data-era", era.era);
    
    outlierGroup.selectAll("circle")
      .data(outliers)
      .join("circle")
      .attr("cx", () => x + (Math.random() - 0.5) * width * 0.3)
      .attr("cy", d => scaleYBox(d))
      .attr("r", 3)
      .attr("fill", era.color)
      .attr("fill-opacity", 0.7);

    boxPlotElements.push({
      era: era.era,
      box: boxRect,
      median: medianLine,
      whisker1,
      whisker2,
      outliers: outlierGroup
    });
  });

  
  subscribe(state => {
    boxPlotElements.forEach(({ era, box, median, whisker1, whisker2, outliers }) => {
      const eraMatch = !state.activeEra || state.activeEra === era;
      const opacity = eraMatch ? 1 : 0.3;
      const strokeWidth = eraMatch ? (state.activeEra === era ? 4 : 2.5) : 1.5;
      const fillOpacity = eraMatch ? (state.activeEra === era ? 0.5 : 0.3) : 0.15;
      
      box.attr("opacity", opacity)
         .attr("fill-opacity", fillOpacity)
         .attr("stroke-width", strokeWidth);
      median.attr("opacity", opacity).attr("stroke-width", eraMatch ? 3 : 2);
      whisker1.attr("opacity", opacity).attr("stroke-width", eraMatch ? 2.5 : 1.5);
      whisker2.attr("opacity", opacity).attr("stroke-width", eraMatch ? 2.5 : 1.5);
      outliers.attr("opacity", opacity);
    });
  });

  
  card6.append("g")
    .attr("transform", `translate(0, ${boxY + boxH - 50})`)
    .call(d3.axisBottom(scaleXBox))
    .call(g => g.selectAll("text")
      .attr("font-size", 10)
      .attr("fill", AXIS_CONFIG.tickFill)
      .attr("dy", "0.35em"))
    .call(g => g.select(".domain")
      .attr("stroke", AXIS_CONFIG.domainColor)
      .attr("stroke-width", AXIS_CONFIG.domainWidth));

  
  const yAxisBox = d3.axisLeft(scaleYBox)
    .tickFormat(d => {
      if (d >= 1e9) return (d / 1e9).toFixed(1) + "G";
      if (d >= 1e6) return (d / 1e6).toFixed(0) + "M";
      return d3.format(".0s")(d);
    })
    .ticks(6);

  card6.append("g")
    .attr("transform", `translate(${boxX + 60}, 0)`)
    .call(yAxisBox)
    .call(g => g.selectAll("text")
      .attr("font-size", 10)
      .attr("fill", AXIS_CONFIG.tickFill)
      .attr("dx", -8))
    .call(g => g.selectAll(".tick line")
      .attr("stroke", "#e2e8f0")
      .attr("stroke-width", 1)
      .attr("x2", -6))
    .call(g => g.select(".domain")
      .attr("stroke", AXIS_CONFIG.domainColor)
      .attr("stroke-width", AXIS_CONFIG.domainWidth));

  card6.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -(boxY + boxH / 2))
    .attr("y", boxX + 20)
    .attr("text-anchor", "middle")
    .attr("fill", AXIS_CONFIG.labelFill)
    .attr("font-size", 12)
    .attr("font-weight", 600)
    .text("Subscribers (log scale)");

  
  const scrubberGroup = card5.append("g")
    .attr("transform", `translate(${streamX}, ${streamY + streamH + 60})`);
  
  const scrubberWidth = streamW;
  const scrubberHeight = 30;
  
  const scrubberScale = d3.scaleLinear()
    .domain([2005, 2023])
    .range([0, scrubberWidth]);
  
  years.forEach((year) => {
    const x = scrubberScale(year);
    scrubberGroup.append("line")
      .attr("x1", x)
      .attr("x2", x)
      .attr("y1", 0)
      .attr("y2", scrubberHeight)
      .attr("stroke", "#94a3b8")
      .attr("stroke-width", 1);
    
    if (year % 2 === 0) {
      scrubberGroup.append("text")
        .attr("x", x)
        .attr("y", -8)
        .attr("text-anchor", "middle")
        .attr("font-size", 9)
        .attr("fill", "#64748b")
        .attr("font-weight", 600)
        .text(year);
    } else {
      scrubberGroup.append("text")
        .attr("x", x)
        .attr("y", scrubberHeight + 12)
        .attr("text-anchor", "middle")
        .attr("font-size", 9)
    .attr("fill", "#94a3b8")
        .text(year);
    }
  });
  
  scrubberGroup.append("rect")
    .attr("width", scrubberWidth)
    .attr("height", scrubberHeight)
    .attr("fill", "#f1f5f9")
    .attr("stroke", "#cbd5e1")
    .attr("stroke-width", 2)
    .attr("rx", scrubberHeight / 2);
  
  
  let scrubberYear = null;
  const handle = scrubberGroup.append("circle")
    .attr("r", 8)
    .attr("fill", "#3b82f6")
    .attr("stroke", "#ffffff")
    .attr("stroke-width", 2)
    .attr("cx", scrubberScale(2014))
    .attr("cy", scrubberHeight / 2)
    .style("cursor", "grab")
    .call(d3.drag()
      .on("start", function() {
        d3.select(this).style("cursor", "grabbing");
      })
      .on("drag", function(event) {
        const [x] = d3.pointer(event, scrubberGroup.node());
        const clampedX = Math.max(0, Math.min(scrubberWidth, x));
        const year = Math.round(scrubberScale.invert(clampedX));
        handle.attr("cx", scrubberScale(year));
        setActive("year", year);
        scrubberYear = year;
      })
      .on("end", function() {
        d3.select(this).style("cursor", "grab");
      }));
  
  
  scrubberGroup.append("rect")
    .attr("width", scrubberWidth)
    .attr("height", scrubberHeight)
    .attr("fill", "transparent")
    .style("cursor", "pointer")
    .on("click", function(event) {
      const [x] = d3.pointer(event, scrubberGroup.node());
      const clampedX = Math.max(0, Math.min(scrubberWidth, x));
      const year = Math.round(scrubberScale.invert(clampedX));
      handle.attr("cx", scrubberScale(year));
      setActive("year", year);
      scrubberYear = year;
    });
  
  
  const updateAllCharts = () => {
    subscribers.forEach(fn => fn(highlightState));
  };
  
  
  subscribe(state => {
    if (state.activeYear && scrubberYear !== state.activeYear) {
      handle.attr("cx", scrubberScale(state.activeYear));
      scrubberYear = state.activeYear;
    } else if (!state.activeYear && scrubberYear !== null) {
      handle.attr("cx", scrubberScale(2014)); 
      scrubberYear = null;
    }
  });

  svg.node().value = null;
return svg.node();
}


function _q6_countryTable(data,d3,Inputs)
{
  const cleanNumber = v => (Number.isFinite(v) && v > 0 ? +v : null);

  const processedData = data
    .map(d => ({
      country: d.Country,
      channel: d.Youtuber,
      category: d.category,
      subs: cleanNumber(d.subscribers || d.Subscribers || d.subs),
      views: cleanNumber(d.video_views || d["video views"] || d["Video Views"] || d.views),
      year: cleanNumber(d.created_year)
    }))
    .filter(d => d.country && d.country !== "nan" && d.subs !== null);

  const countryStats = d3.rollups(
    processedData,
    v => ({
      count: v.length,
      avgSubscribers: d3.mean(v, d => d.subs),
      avgViews: d3.mean(v, d => d.views),
      totalSubscribers: d3.sum(v, d => d.subs),
      totalViews: d3.sum(v, d => d.views),
      avgYearCreated: d3.mean(v.filter(d => d.year), d => d.year),
      topChannel: v.sort((a, b) => b.subs - a.subs)[0]?.channel,
      topCategory: d3.rollups(v, vv => vv.length, d => d.category)
        .sort((a, b) => b[1] - a[1])[0]?.[0],
      categories: [...new Set(v.map(d => d.category))].length
    }),
    d => d.country
  );

  const tableData = countryStats
    .map(([country, stats]) => ({
      Country: country,
      Channels: stats.count,
      "Total Subscribers": stats.totalSubscribers 
        ? Math.round(stats.totalSubscribers).toLocaleString() 
        : "0",
      "Avg Subscribers": stats.avgSubscribers 
        ? Math.round(stats.avgSubscribers).toLocaleString() 
        : "0",
      "Total Views": stats.totalViews 
        ? Math.round(stats.totalViews).toLocaleString() 
        : "0",
      "Avg Views": stats.avgViews 
        ? Math.round(stats.avgViews).toLocaleString() 
        : "0",
      "Top Channel": stats.topChannel || "N/A",
      "Top Category": stats.topCategory || "N/A",
      "Categories": stats.categories,
      "Avg Year": stats.avgYearCreated 
        ? Math.round(stats.avgYearCreated) 
        : "N/A"
    }))
    .sort((a, b) => {
      const aVal = parseInt(a["Total Subscribers"].replace(/,/g, "")) || 0;
      const bVal = parseInt(b["Total Subscribers"].replace(/,/g, "")) || 0;
      return bVal - aVal;
    });

  return Inputs.table(tableData, {
    format: {
      "Channels": d3.format(","),
      "Total Subscribers": d => d,
      "Avg Subscribers": d => d,
      "Total Views": d => d,
      "Avg Views": d => d,
      "Categories": d3.format(",")
    },
    columns: [
      "Country",
      "Channels", 
      "Total Subscribers",
      "Avg Subscribers",
      "Total Views",
      "Avg Views",
      "Top Channel",
      "Top Category",
      "Categories",
      "Avg Year"
    ]
  });
}


function _27(md){return(
md`# Question 6: Upload Frequency vs Success

## Overview

I analyzed the relationship between how often YouTube channels upload content and their success metrics (subscribers, views). The data includes 899 top channels with their upload counts, subscriber counts, video views, and categories.

I grouped channels into three upload frequency groups: Low (bottom third), Medium (middle third), and High (top third). The main question is: Does uploading more videos lead to more subscribers? Which categories benefit most from frequent uploads? Is there a sweet spot?

---

## What I'm Analyzing and Why

The common assumption is that uploading more content leads to more success. But is that always true? Some channels might succeed with fewer, higher-quality videos. Others might need frequent uploads to stay relevant.

I created six visualizations to explore this:
1. **Hexbin Density** - Shows the overall relationship between uploads and subscribers
2. **Box Plots** - Compares subscriber distributions across upload frequency groups
3. **Diverging Bars** - Shows which categories benefit from more uploads vs. quality over quantity
4. **Sweet Spot Analysis** - Identifies optimal upload ranges for maximum subscribers
5. **Quality Champions** - Highlights channels with highest subscribers-per-upload ratios
6. **Key Insights** - Summary findings

---

## Visualization Design

### 1. Hexbin Density: Uploads vs Subscribers
Shows the density of channels across upload and subscriber ranges using hexagonal bins. Color intensity shows how many channels fall into each area. This reveals where most successful channels cluster - do they upload a lot or a little? Are there clear patterns?

### 2. Box Plots: Subscribers by Upload Frequency
Compares subscriber distributions for Low, Medium, and High upload groups. Boxes show medians and quartiles, whiskers show ranges, dots show outliers. This answers: do high uploaders actually have more subscribers on average?

### 3. Diverging Bars: Category-Specific Benefit
Shows the difference in median subscribers between High and Low uploaders for each category. Bars going right (green) mean more uploads help. Bars going left (orange) mean quality over quantity works better. This shows which categories benefit from frequent uploads.

### 4. Sweet Spot Analysis
Groups channels into upload buckets (e.g., 0-100, 100-500, 500-1000) and shows average subscribers for each bucket. A line connects the averages to show the trend. This identifies the optimal upload range for maximum subscribers.

### 5. Quality Champions
Shows top channels ranked by subscribers-per-upload ratio. This highlights channels that achieve high subscriber counts with relatively few uploads - the efficiency winners.

### 6. Key Insights
Summary cards showing key findings like the sweet spot range, median subscribers by group, best category for uploads, and top efficiency channel.

---

## Why Six Charts Together

Each chart answers a different part of the question. They're all linked - clicking a category or upload group highlights it across charts. This lets you see how upload frequency affects success from multiple angles.

For example, clicking "Gaming" shows its position in the hexbin, its box plot distribution, whether it benefits from uploads (diverging bar), and its quality champions.

---

## Key Findings

1. **Upload Frequency Groups:**
   - Low uploaders: Bottom third by upload count
   - Medium uploaders: Middle third
   - High uploaders: Top third
   - High uploaders generally have more subscribers, but the relationship isn't linear

2. **Category Differences:**
   - Some categories (like Entertainment, Music) benefit from frequent uploads
   - Other categories (like Education, Howto & Style) show quality over quantity works better
   - The diverging bars clearly show which categories gain from more uploads vs. fewer, better videos

3. **Sweet Spot:**
   - There's an optimal upload range that maximizes subscribers
   - Too few uploads = less visibility
   - Too many uploads = diminishing returns or quality issues
   - The sweet spot varies by category

4. **Quality Champions:**
   - Some channels achieve high subscribers with relatively few uploads
   - These channels have high subscribers-per-upload ratios
   - Shows that quality and strategy matter, not just quantity

5. **Overall Pattern:**
   - More uploads generally correlate with more subscribers
   - But the relationship has diminishing returns
   - Category matters - some benefit more from upload frequency than others

---

## How to Use the Dashboard

Click any category or upload group to see it highlighted across all charts. Hover over hexbins, bars, or boxes for detailed numbers. The coordinated views help you understand how upload frequency affects success in different ways.

---

## Conclusion

Upload frequency does matter for YouTube success, but it's not straightforward. More uploads generally help, but there's a sweet spot. Some categories benefit more from frequent uploads, while others succeed with quality over quantity. The best strategy depends on your category and content type.

**Main Insights:**
- More uploads generally lead to more subscribers, but with diminishing returns
- There's an optimal upload range that maximizes success
- Category matters - some benefit more from upload frequency
- Quality champions show that strategy and content quality can beat pure quantity
- The relationship between uploads and success varies significantly by category`
)}

async function _q6_uploadStrategy(require,data,d3)
{
  const d3Hexbin = await require("d3-hexbin@0.2");
  
  const CFG = {
    W: 1600,
    H: 2400,
    PAD: 30,
    CARD_PAD: 25,
    GRID_GAP: 20,
    FONT: "13px/1.5 'Inter', system-ui, sans-serif"
  };

  const AXIS_CONFIG = {
    tickFontSize: 11,
    tickFontWeight: 500,
    tickFill: "#475569",
    domainWidth: 2,
    domainColor: "#334155",
    gridColor: "#e2e8f0",
    gridWidth: 0.5,
    labelFontSize: 12,
    labelFontWeight: 600,
    labelFill: "#0f172a"
  };

  const cleanNumber = v => (Number.isFinite(v) && v > 0 ? +v : null);

  const processedData = data
    .map(d => ({
      channel: d.Youtuber,
      category: d.category,
      subs: cleanNumber(d.subscribers || d.Subscribers),
      views: cleanNumber(d.video_views || d["video views"] || d["Video Views"]),
      uploads: cleanNumber(d.uploads || d.Uploads || d["video_count"] || d["Video Count"]),
      country: d.Country,
      year: cleanNumber(d.created_year)
    }))
    .filter(d => d.subs !== null && d.uploads !== null && d.uploads > 0 && d.category && d.category !== "nan");

  const uploadQuantiles = d3.quantile(processedData.map(d => d.uploads).sort(d3.ascending), 0.33);
  const uploadQuantile67 = d3.quantile(processedData.map(d => d.uploads).sort(d3.ascending), 0.67);

  processedData.forEach(d => {
    if (d.uploads <= uploadQuantiles) d.uploadGroup = "Low";
    else if (d.uploads <= uploadQuantile67) d.uploadGroup = "Medium";
    else d.uploadGroup = "High";
    d.subsPerUpload = d.subs / d.uploads;
    d.viewsPerUpload = d.views / d.uploads;
  });

  const categories = [...new Set(processedData.map(d => d.category))].sort();
  const topCategories = d3.rollups(processedData, v => v.length, d => d.category)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(d => d[0]);

  const categoryColors = d3.scaleOrdinal()
    .domain(["Entertainment", "Music", "People & Blogs", "Gaming", "Comedy", "Education", "Howto & Style", "Science & Technology", "Sports", "Film & Animation", "Other"])
    .range(["#3b82f6", "#f59e0b", "#10b981", "#ef4444", "#8b5cf6", "#06b6d4", "#ec4899", "#14b8a6", "#f97316", "#6366f1", "#6b7280"]);

  const getCategoryColor = cat => {
    if (topCategories.includes(cat)) return categoryColors(cat);
    return categoryColors("Other");
  };

  const uploadGroups = ["Low", "Medium", "High"];
  const groupColors = { "Low": "#3b82f6", "Medium": "#f59e0b", "High": "#10b981" };

  const highlightState = {
    activeCategory: null,
    activeGroup: null,
    activeChannel: null
  };

  const subscribers = [];
  const subscribe = fn => subscribers.push(fn);
  const setActive = (type, value) => {
    if (type === "category") highlightState.activeCategory = value;
    if (type === "group") highlightState.activeGroup = value;
    if (type === "channel") highlightState.activeChannel = value;
    subscribers.forEach(fn => fn(highlightState));
  };
  const clearActive = () => {
    highlightState.activeCategory = null;
    highlightState.activeGroup = null;
    highlightState.activeChannel = null;
    subscribers.forEach(fn => fn(highlightState));
  };

  const svg = d3.create("svg")
    .attr("viewBox", [0, 0, CFG.W, CFG.H])
    .attr("width", CFG.W)
    .attr("height", CFG.H)
    .attr("style", `max-width: 100%; height: auto; display: block; font: ${CFG.FONT}; background: linear-gradient(to bottom, #f8fafc 0%, #f1f5f9 100%); color: #1a202c;`)
    .attr("role", "img")
    .attr("aria-label", "Upload Frequency vs Success Analysis");

  const defs = svg.append("defs");
  const shadowFilter = defs.append("filter")
    .attr("id", "cardShadow6")
    .attr("x", "-20%").attr("y", "-20%")
    .attr("width", "140%").attr("height", "140%");
  shadowFilter.append("feDropShadow")
    .attr("dx", 0).attr("dy", 4)
    .attr("stdDeviation", 8)
    .attr("flood-color", "rgba(0,0,0,0.08)");

  const glowFilter = defs.append("filter")
    .attr("id", "glow6")
    .attr("x", "-50%").attr("y", "-50%")
    .attr("width", "200%").attr("height", "200%");
  glowFilter.append("feGaussianBlur")
    .attr("stdDeviation", 3)
    .attr("result", "coloredBlur");
  const feMerge = glowFilter.append("feMerge");
  feMerge.append("feMergeNode").attr("in", "coloredBlur");
  feMerge.append("feMergeNode").attr("in", "SourceGraphic");

  const titleGradient = defs.append("linearGradient")
    .attr("id", "titleGradient6")
    .attr("x1", "0%").attr("y1", "0%")
    .attr("x2", "100%").attr("y2", "0%");
  titleGradient.append("stop").attr("offset", "0%").attr("stop-color", "#3b82f6");
  titleGradient.append("stop").attr("offset", "50%").attr("stop-color", "#10b981");
  titleGradient.append("stop").attr("offset", "100%").attr("stop-color", "#f59e0b");

  svg.append("text")
    .attr("x", CFG.PAD)
    .attr("y", CFG.PAD + 35)
    .attr("font-size", 32)
    .attr("font-weight", 800)
    .attr("fill", "url(#titleGradient6)")
    .text("Q6: Upload Frequency vs Success - Optimal Strategy Analysis");

  svg.append("text")
    .attr("x", CFG.PAD)
    .attr("y", CFG.PAD + 60)
    .attr("font-size", 14)
    .attr("fill", "#64748b")
    .text("Do channels that upload more frequently have more success? Discover the optimal upload strategy and category-specific insights!");

  const buildTooltip = () => {
    const g = svg.append("g")
      .attr("class", "tooltip-group")
      .style("pointer-events", "none")
      .attr("opacity", 0);
    const bg = g.append("rect")
      .attr("fill", "rgba(255,255,255,0.98)")
      .attr("stroke", "#334155")
      .attr("stroke-width", 2)
      .attr("rx", 8)
      .attr("filter", "url(#cardShadow6)");
    const tx = g.append("text")
      .attr("x", 12)
      .attr("y", 20)
      .attr("font-size", 11)
      .attr("font-family", "system-ui, sans-serif");
    const show = (event, lines) => {
      if (!event || !lines || lines.length === 0) return;
      let mx, my;
      try {
        [mx, my] = d3.pointer(event, svg.node());
      } catch (e) {
        try {
          if (event.clientX !== undefined && event.clientY !== undefined) {
            const rect = svg.node().getBoundingClientRect();
            mx = event.clientX - rect.left;
            my = event.clientY - rect.top;
          } else {
            return;
          }
        } catch (e2) {
          return;
        }
      }
      tx.selectAll("tspan").remove();
      lines.forEach((line, i) => {
        if (!line) return;
        const tspan = tx.append("tspan")
          .attr("x", 12)
          .attr("dy", i ? 16 : 0)
          .text(String(line));
        if (i === 0) {
          tspan.attr("font-weight", 700).attr("fill", "#0f172a").attr("font-size", 12);
        } else {
          tspan.attr("fill", "#475569").attr("font-size", 10);
        }
      });
      const bb = tx.node().getBBox();
      bg.attr("x", bb.x - 10).attr("y", bb.y - 8)
        .attr("width", bb.width + 20).attr("height", bb.height + 16);
      let x = mx + 12, y = my - bb.height - 20;
      if (x + bb.width + 20 > CFG.W) x = mx - bb.width - 25;
      if (y < 10) y = my + 20;
      x = Math.min(CFG.W - bb.width - 30, Math.max(10, x));
      y = Math.max(10, Math.min(CFG.H - bb.height - 20, y));
      g.attr("transform", `translate(${x}, ${y})`).attr("opacity", 1);
    };
    const hide = () => {
      g.attr("opacity", 0);
    };
    return { show, hide };
  };
  const tooltip = buildTooltip();

  const chartLayer = svg.append("g").attr("transform", `translate(${CFG.PAD}, ${CFG.PAD + 85})`);
  const availableWidth = CFG.W - 2 * CFG.PAD;

  const card1W = (availableWidth - CFG.GRID_GAP) * 0.55;
  const card1H = 550;
  const card1 = chartLayer.append("g");

  card1.append("rect")
    .attr("width", card1W)
    .attr("height", card1H)
    .attr("fill", "#ffffff")
    .attr("stroke", "#e2e8f0")
    .attr("stroke-width", 2)
    .attr("rx", 16)
    .attr("filter", "url(#cardShadow6)");

  card1.append("text")
    .attr("x", CFG.CARD_PAD)
    .attr("y", CFG.CARD_PAD + 24)
    .attr("font-size", 20)
    .attr("font-weight", 700)
    .attr("fill", "#0f172a")
    .text("1. Hexbin Density: Uploads vs Subscribers");

  card1.append("text")
    .attr("x", CFG.CARD_PAD)
    .attr("y", CFG.CARD_PAD + 46)
    .attr("font-size", 11)
    .attr("fill", "#64748b")
    .text("Color = channel density. Reveals where most successful channels cluster.");

  const hexW = card1W - CFG.CARD_PAD * 2 - 100;
  const hexH = card1H - CFG.CARD_PAD * 2 - 120;
  const hexX = CFG.CARD_PAD + 60;
  const hexY = CFG.CARD_PAD + 80;

  const validData = processedData.filter(d => d.uploads > 0 && d.subs > 0);
  const minUploads = d3.quantile(validData.map(d => d.uploads).sort(d3.ascending), 0.01) || 1;
  const maxUploads = d3.quantile(validData.map(d => d.uploads).sort(d3.ascending), 0.99);
  const minSubs = d3.quantile(validData.map(d => d.subs).sort(d3.ascending), 0.01) || 1000;
  const maxSubs = d3.quantile(validData.map(d => d.subs).sort(d3.ascending), 0.99);

  const scaleXHex = d3.scaleLog()
    .domain([minUploads, maxUploads])
    .range([0, hexW])
    .clamp(true);

  const scaleYHex = d3.scaleLog()
    .domain([minSubs, maxSubs])
    .range([hexH, 0])
    .clamp(true);

  const hexRadius = 15;
  const hexbin = d3Hexbin.hexbin()
    .x(d => scaleXHex(Math.max(minUploads, Math.min(d.uploads, maxUploads))))
    .y(d => scaleYHex(Math.max(minSubs, Math.min(d.subs, maxSubs))))
    .radius(hexRadius)
    .extent([[0, 0], [hexW, hexH]]);

  const hexbinData = hexbin(validData);
  const filteredHexData = hexbinData.filter(d => 
    d.length > 0 && 
    d.x >= hexRadius && 
    d.x <= hexW - hexRadius && 
    d.y >= hexRadius && 
    d.y <= hexH - hexRadius
  );

  const maxDensity = d3.max(filteredHexData, d => d.length) || 1;
  const colorScaleHex = d3.scaleSequential(d3.interpolateBlues)
    .domain([0, maxDensity]);

  const hexGroup = card1.append("g").attr("transform", `translate(${hexX}, ${hexY})`);

  hexGroup.append("rect")
    .attr("width", hexW)
    .attr("height", hexH)
    .attr("fill", "#f8fafc")
    .attr("stroke", "#94a3b8")
    .attr("stroke-width", 1);

  const hexPaths = hexGroup.selectAll("path.hex")
    .data(filteredHexData)
    .join("path")
    .attr("class", "hex")
    .attr("d", hexbin.hexagon())
    .attr("transform", d => `translate(${d.x}, ${d.y})`)
    .attr("fill", d => colorScaleHex(d.length))
    .attr("stroke", "#2563eb")
    .attr("stroke-width", 1)
    .attr("opacity", 0.9)
    .style("cursor", "pointer");

  hexPaths.on("mouseenter mouseover", function(event, d) {
    if (!d || !Array.isArray(d) || d.length === 0) return;
    const avgSubs = d3.mean(d, dd => dd.subs);
    const avgUploads = d3.mean(d, dd => dd.uploads);
    const topCat = d3.rollups(d, v => v.length, dd => dd.category).sort((a, b) => b[1] - a[1])[0]?.[0];
    tooltip.show(event, [
      `${d.length} Channels in this area`,
      `Avg Uploads: ${d3.format(",")(Math.round(avgUploads))}`,
      `Avg Subscribers: ${d3.format(".2s")(avgSubs)}`,
      `Top Category: ${topCat || "Various"}`
    ]);
    d3.select(this).attr("stroke-width", 2.5).attr("stroke", "#0f172a").attr("opacity", 1);
  })
  .on("mouseleave mouseout", function(event) {
    tooltip.hide();
    d3.select(this).attr("stroke-width", 1).attr("stroke", "#2563eb").attr("opacity", 0.9);
  });

  card1.append("g")
    .attr("transform", `translate(${hexX}, ${hexY + hexH})`)
    .call(d3.axisBottom(scaleXHex).ticks(5, "~s"))
    .call(g => g.selectAll("text").attr("font-size", 9).attr("fill", AXIS_CONFIG.tickFill))
    .call(g => g.select(".domain").attr("stroke", AXIS_CONFIG.domainColor));

  card1.append("g")
    .attr("transform", `translate(${hexX}, ${hexY})`)
    .call(d3.axisLeft(scaleYHex).ticks(5, "~s"))
    .call(g => g.selectAll("text").attr("font-size", 9).attr("fill", AXIS_CONFIG.tickFill))
    .call(g => g.select(".domain").attr("stroke", AXIS_CONFIG.domainColor));

  card1.append("text")
    .attr("x", hexX + hexW / 2)
    .attr("y", hexY + hexH + 38)
    .attr("text-anchor", "middle")
    .attr("font-size", 10)
    .attr("font-weight", 600)
    .attr("fill", AXIS_CONFIG.labelFill)
    .text("Uploads (log scale)");

  card1.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -(hexY + hexH / 2))
    .attr("y", hexX - 45)
    .attr("text-anchor", "middle")
    .attr("font-size", 10)
    .attr("font-weight", 600)
    .attr("fill", AXIS_CONFIG.labelFill)
    .text("Subscribers (log scale)");

  const legendHex = card1.append("g")
    .attr("transform", `translate(${card1W - 75}, ${CFG.CARD_PAD - 5})`);

  legendHex.append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", 70)
    .attr("height", 120)
    .attr("fill", "rgba(255,255,255,0.98)")
    .attr("stroke", "#cbd5e1")
    .attr("stroke-width", 1.5)
    .attr("rx", 8)
    .attr("filter", "url(#cardShadow6)");

  legendHex.append("text")
    .attr("x", 35)
    .attr("y", 18)
    .attr("text-anchor", "middle")
    .attr("font-size", 10)
    .attr("font-weight", 700)
    .attr("fill", "#0f172a")
    .text("Density");

  const legendHexHeight = 70;
  const legendHexGradient = defs.append("linearGradient")
    .attr("id", "hexLegendGradient")
    .attr("x1", "0%").attr("y1", "100%")
    .attr("x2", "0%").attr("y2", "0%");

  for (let i = 0; i <= 10; i++) {
    const t = i / 10;
    legendHexGradient.append("stop")
      .attr("offset", `${i * 10}%`)
      .attr("stop-color", d3.interpolateBlues(t));
  }

  legendHex.append("rect")
    .attr("x", 10)
    .attr("y", 28)
    .attr("width", 18)
    .attr("height", legendHexHeight)
    .attr("fill", "url(#hexLegendGradient)")
    .attr("stroke", "#94a3b8")
    .attr("rx", 3);

  legendHex.append("text").attr("x", 35).attr("y", 35).attr("text-anchor", "middle").attr("font-size", 9).attr("font-weight", 600).attr("fill", "#0f172a").text(`${maxDensity}`);
  legendHex.append("text").attr("x", 35).attr("y", 65).attr("text-anchor", "middle").attr("font-size", 8).attr("fill", "#64748b").text("ch.");
  legendHex.append("text").attr("x", 35).attr("y", 95).attr("text-anchor", "middle").attr("font-size", 9).attr("font-weight", 600).attr("fill", "#0f172a").text("1");

  const card2X = card1W + CFG.GRID_GAP;
  const card2W = availableWidth - card1W - CFG.GRID_GAP;
  const card2H = card1H;
  const card2 = chartLayer.append("g").attr("transform", `translate(${card2X}, 0)`);

  card2.append("rect")
    .attr("width", card2W)
    .attr("height", card2H)
    .attr("fill", "#ffffff")
    .attr("stroke", "#e2e8f0")
    .attr("stroke-width", 2)
    .attr("rx", 16)
    .attr("filter", "url(#cardShadow6)");

  card2.append("text")
    .attr("x", CFG.CARD_PAD)
    .attr("y", CFG.CARD_PAD + 24)
    .attr("font-size", 20)
    .attr("font-weight", 700)
    .attr("fill", "#0f172a")
    .text("2. Box Plots: Subscribers by Upload Frequency");

  card2.append("text")
    .attr("x", CFG.CARD_PAD)
    .attr("y", CFG.CARD_PAD + 46)
    .attr("font-size", 11)
    .attr("fill", "#64748b")
    .text("Dots colored by category. Notable outliers labeled.");

  const boxW = card2W - CFG.CARD_PAD * 2 - 60;
  const boxH = card2H - CFG.CARD_PAD * 2 - 120;
  const boxX = CFG.CARD_PAD + 60;
  const boxY = CFG.CARD_PAD + 80;

  const scaleXBox = d3.scaleBand()
    .domain(uploadGroups)
    .range([0, boxW])
    .padding(0.3);

  const scaleYBox = d3.scaleLinear()
    .domain([0, d3.quantile(processedData.map(d => d.subs).sort(d3.ascending), 0.98)])
    .range([boxH, 0])
    .nice();

  uploadGroups.forEach(group => {
    const groupData = processedData.filter(d => d.uploadGroup === group);
    const subs = groupData.map(d => d.subs).sort(d3.ascending);
    
    if (subs.length === 0) return;

    const q1 = d3.quantile(subs, 0.25);
    const median = d3.quantile(subs, 0.5);
    const q3 = d3.quantile(subs, 0.75);
    const iqr = q3 - q1;
    const min = Math.max(subs[0], q1 - 1.5 * iqr);
    const max = Math.min(subs[subs.length - 1], q3 + 1.5 * iqr);

    const x = boxX + scaleXBox(group) + scaleXBox.bandwidth() / 2;
    const width = scaleXBox.bandwidth() * 0.6;

    card2.append("rect")
      .attr("x", x - width / 2)
      .attr("y", boxY + scaleYBox(q3))
      .attr("width", width)
      .attr("height", scaleYBox(q1) - scaleYBox(q3))
      .attr("fill", groupColors[group])
      .attr("fill-opacity", 0.2)
      .attr("stroke", groupColors[group])
      .attr("stroke-width", 2)
      .attr("rx", 4);

    card2.append("line")
      .attr("x1", x - width / 2)
      .attr("x2", x + width / 2)
      .attr("y1", boxY + scaleYBox(median))
      .attr("y2", boxY + scaleYBox(median))
      .attr("stroke", groupColors[group])
      .attr("stroke-width", 3);

    card2.append("line")
      .attr("x1", x)
      .attr("x2", x)
      .attr("y1", boxY + scaleYBox(min))
      .attr("y2", boxY + scaleYBox(q1))
      .attr("stroke", groupColors[group])
      .attr("stroke-width", 2);

    card2.append("line")
      .attr("x1", x)
      .attr("x2", x)
      .attr("y1", boxY + scaleYBox(q3))
      .attr("y2", boxY + scaleYBox(max))
      .attr("stroke", groupColors[group])
      .attr("stroke-width", 2);

    const jitterWidth = width * 0.8;
    groupData.slice(0, 150).forEach(d => {
      const jitter = (Math.random() - 0.5) * jitterWidth;
      const dot = card2.append("circle")
        .attr("cx", x + jitter)
        .attr("cy", boxY + scaleYBox(Math.min(d.subs, scaleYBox.domain()[1])))
        .attr("r", 4)
        .attr("fill", getCategoryColor(d.category))
        .attr("fill-opacity", 0.7)
        .attr("stroke", getCategoryColor(d.category))
        .attr("stroke-width", 1)
        .style("cursor", "pointer")
        .on("pointerenter", function(event) {
          setActive("channel", d.channel);
          setActive("category", d.category);
          tooltip.show(event, [
            d.channel,
            `Category: ${d.category}`,
            `Subscribers: ${d3.format(".2s")(d.subs)}`,
            `Uploads: ${d3.format(",")(d.uploads)}`,
            `Upload Group: ${d.uploadGroup}`,
            `Subs/Upload: ${d3.format(".2s")(d.subsPerUpload)}`
          ]);
          d3.select(this).attr("r", 7).attr("fill-opacity", 1);
        })
        .on("pointerleave", function() {
          clearActive();
          tooltip.hide();
          d3.select(this).attr("r", 4).attr("fill-opacity", 0.7);
        });

      subscribe(state => {
        const match = (!state.activeCategory || state.activeCategory === d.category) &&
                      (!state.activeGroup || state.activeGroup === d.uploadGroup);
        dot.attr("fill-opacity", match ? 0.7 : 0.1);
      });
    });

    const topOutliers = groupData
      .filter(d => d.subs > q3 + 1.5 * iqr)
      .sort((a, b) => b.subs - a.subs)
      .slice(0, 3);

    topOutliers.forEach((d, i) => {
      if (scaleYBox(d.subs) >= 0) {
        card2.append("text")
          .attr("x", x + width / 2 + 5)
          .attr("y", boxY + scaleYBox(Math.min(d.subs, scaleYBox.domain()[1])) + i * 14)
          .attr("font-size", 9)
          .attr("fill", "#64748b")
          .text(d.channel.length > 12 ? d.channel.substring(0, 10) + ".." : d.channel);
      }
    });
  });

  card2.append("g")
    .attr("transform", `translate(${boxX}, ${boxY + boxH})`)
    .call(d3.axisBottom(scaleXBox))
    .call(g => g.selectAll("text").attr("font-size", 12).attr("font-weight", 600).attr("fill", AXIS_CONFIG.tickFill))
    .call(g => g.select(".domain").attr("stroke", AXIS_CONFIG.domainColor));

  card2.append("g")
    .attr("transform", `translate(${boxX}, ${boxY})`)
    .call(d3.axisLeft(scaleYBox).ticks(6).tickFormat(d3.format(".2s")))
    .call(g => g.selectAll("text").attr("font-size", 10).attr("fill", AXIS_CONFIG.tickFill))
    .call(g => g.select(".domain").attr("stroke", AXIS_CONFIG.domainColor));

  card2.append("text")
    .attr("x", boxX + boxW / 2)
    .attr("y", boxY + boxH + 40)
    .attr("text-anchor", "middle")
    .attr("font-size", 11)
    .attr("font-weight", 600)
    .attr("fill", AXIS_CONFIG.labelFill)
    .text("Upload Frequency Group");

  card2.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -(boxY + boxH / 2))
    .attr("y", boxX - 45)
    .attr("text-anchor", "middle")
    .attr("font-size", 11)
    .attr("font-weight", 600)
    .attr("fill", AXIS_CONFIG.labelFill)
    .text("Subscribers");

  const legendBox = card2.append("g")
    .attr("transform", `translate(${card2W - 100}, ${CFG.CARD_PAD - 5})`);

  legendBox.append("rect")
    .attr("x", -10)
    .attr("y", -10)
    .attr("width", 150)
    .attr("height", 90)
    .attr("fill", "rgba(255,255,255,0.95)")
    .attr("stroke", "#e2e8f0")
    .attr("rx", 8);

  legendBox.append("text").attr("y", 8).attr("font-size", 10).attr("font-weight", 700).attr("fill", "#0f172a").text("Categories");

  const legendCats = ["Entertainment", "Music", "Gaming", "People & Blogs", "Other"];
  legendCats.forEach((cat, i) => {
    const g = legendBox.append("g").attr("transform", `translate(0, ${18 + i * 14})`);
    g.append("circle").attr("r", 4).attr("fill", getCategoryColor(cat));
    g.append("text").attr("x", 10).attr("y", 4).attr("font-size", 9).attr("fill", "#475569").text(cat);
  });

  const card3Y = card1H + CFG.GRID_GAP;
  const card3W = availableWidth;
  const card3H = 600;
  const card3 = chartLayer.append("g").attr("transform", `translate(0, ${card3Y})`);

  card3.append("rect")
    .attr("width", card3W)
    .attr("height", card3H)
    .attr("fill", "#ffffff")
    .attr("stroke", "#e2e8f0")
    .attr("stroke-width", 2)
    .attr("rx", 16)
    .attr("filter", "url(#cardShadow6)");

  card3.append("text")
    .attr("x", CFG.CARD_PAD)
    .attr("y", CFG.CARD_PAD + 24)
    .attr("font-size", 20)
    .attr("font-weight", 700)
    .attr("fill", "#0f172a")
    .text("3. Diverging Bars: Category-Specific Benefit of Uploading More");

  card3.append("text")
    .attr("x", CFG.CARD_PAD)
    .attr("y", CFG.CARD_PAD + 46)
    .attr("font-size", 11)
    .attr("fill", "#64748b")
    .text("Difference in median subscribers: High uploaders minus Low uploaders. Green = more uploads help, Orange = quality over quantity.");

  const categoryBenefit = categories.map(cat => {
    const catData = processedData.filter(d => d.category === cat);
    const lowData = catData.filter(d => d.uploadGroup === "Low");
    const highData = catData.filter(d => d.uploadGroup === "High");
    
    const lowMedian = d3.median(lowData, d => d.subs) || 0;
    const highMedian = d3.median(highData, d => d.subs) || 0;
    
    return {
      category: cat,
      benefit: highMedian - lowMedian,
      lowMedian,
      highMedian,
      lowCount: lowData.length,
      highCount: highData.length
    };
  }).filter(d => d.lowCount >= 5 && d.highCount >= 5)
   .sort((a, b) => b.benefit - a.benefit);

  const divergeW = card3W - CFG.CARD_PAD * 2 - 200;
  const divergeH = card3H - CFG.CARD_PAD * 2 - 100;
  const divergeX = CFG.CARD_PAD + 180;
  const divergeY = CFG.CARD_PAD + 70;
  const divergeCenter = divergeX + divergeW / 2;

  const maxBenefit = d3.max(categoryBenefit, d => Math.abs(d.benefit));

  const scaleXDiverge = d3.scaleLinear()
    .domain([-maxBenefit, maxBenefit])
    .range([0, divergeW])
    .nice();

  const scaleYDiverge = d3.scaleBand()
    .domain(categoryBenefit.map(d => d.category))
    .range([0, divergeH])
    .padding(0.2);

  card3.append("line")
    .attr("x1", divergeCenter)
    .attr("x2", divergeCenter)
    .attr("y1", divergeY)
    .attr("y2", divergeY + divergeH)
    .attr("stroke", "#0f172a")
    .attr("stroke-width", 2);

  categoryBenefit.forEach(d => {
    const y = divergeY + scaleYDiverge(d.category);
    const barWidth = Math.abs(scaleXDiverge(d.benefit) - scaleXDiverge(0));
    const barX = d.benefit >= 0 ? divergeCenter : divergeCenter - barWidth;
    const color = d.benefit >= 0 ? "#10b981" : "#f59e0b";

    card3.append("text")
      .attr("x", divergeX - 10)
      .attr("y", y + scaleYDiverge.bandwidth() / 2 + 4)
      .attr("text-anchor", "end")
      .attr("font-size", 11)
      .attr("font-weight", 500)
      .attr("fill", "#334155")
      .text(d.category.length > 20 ? d.category.substring(0, 18) + ".." : d.category);

    const bar = card3.append("rect")
      .attr("x", barX)
      .attr("y", y)
      .attr("width", barWidth)
      .attr("height", scaleYDiverge.bandwidth())
      .attr("fill", color)
      .attr("rx", 3)
      .attr("opacity", 0.8)
      .style("cursor", "pointer")
      .on("pointerenter", function(event) {
        setActive("category", d.category);
        tooltip.show(event, [
          d.category,
          `Benefit: ${d.benefit >= 0 ? "+" : ""}${d3.format(".2s")(d.benefit)} subs`,
          `Low uploaders median: ${d3.format(".2s")(d.lowMedian)}`,
          `High uploaders median: ${d3.format(".2s")(d.highMedian)}`,
          `Sample: ${d.lowCount} low, ${d.highCount} high`
        ]);
        d3.select(this).attr("opacity", 1).attr("filter", "url(#glow6)");
      })
      .on("pointerleave", function() {
        clearActive();
        tooltip.hide();
        d3.select(this).attr("opacity", 0.8).attr("filter", null);
      });

    const labelX = d.benefit >= 0 ? barX + barWidth + 5 : barX - 5;
    const labelAnchor = d.benefit >= 0 ? "start" : "end";
    
    card3.append("text")
      .attr("x", labelX)
      .attr("y", y + scaleYDiverge.bandwidth() / 2 + 4)
      .attr("text-anchor", labelAnchor)
      .attr("font-size", 10)
      .attr("font-weight", 600)
      .attr("fill", color)
      .text(`${d.benefit >= 0 ? "+" : ""}${d3.format(".2s")(d.benefit)}`);

    subscribe(state => {
      const match = !state.activeCategory || state.activeCategory === d.category;
      bar.attr("opacity", match ? 0.8 : 0.2);
    });
  });

  card3.append("g")
    .attr("transform", `translate(${divergeX}, ${divergeY + divergeH})`)
    .call(d3.axisBottom(scaleXDiverge).ticks(8).tickFormat(d => d3.format(".2s")(d)))
    .call(g => g.selectAll("text").attr("font-size", 10).attr("fill", AXIS_CONFIG.tickFill))
    .call(g => g.select(".domain").attr("stroke", AXIS_CONFIG.domainColor));

  card3.append("text")
    .attr("x", divergeCenter)
    .attr("y", divergeY + divergeH + 45)
    .attr("text-anchor", "middle")
    .attr("font-size", 11)
    .attr("font-weight", 600)
    .attr("fill", AXIS_CONFIG.labelFill)
    .text("High uploads − Low uploads (median subscribers difference)");

  const legendDiverge = card3.append("g")
    .attr("transform", `translate(${divergeX + divergeW - 200}, ${divergeY - 25})`);

  legendDiverge.append("rect").attr("width", 12).attr("height", 12).attr("fill", "#10b981").attr("rx", 2);
  legendDiverge.append("text").attr("x", 16).attr("y", 10).attr("font-size", 10).attr("fill", "#475569").text("More uploads help");
  legendDiverge.append("rect").attr("x", 120).attr("width", 12).attr("height", 12).attr("fill", "#f59e0b").attr("rx", 2);
  legendDiverge.append("text").attr("x", 136).attr("y", 10).attr("font-size", 10).attr("fill", "#475569").text("Quality > Quantity");

  const card4Y = card3Y + card3H + CFG.GRID_GAP;
  const card4W = (availableWidth - CFG.GRID_GAP) / 2;
  const card4H = 450;
  const card4 = chartLayer.append("g").attr("transform", `translate(0, ${card4Y})`);

  card4.append("rect")
    .attr("width", card4W)
    .attr("height", card4H)
    .attr("fill", "#ffffff")
    .attr("stroke", "#e2e8f0")
    .attr("stroke-width", 2)
    .attr("rx", 16)
    .attr("filter", "url(#cardShadow6)");

  card4.append("text")
    .attr("x", CFG.CARD_PAD)
    .attr("y", CFG.CARD_PAD + 24)
    .attr("font-size", 20)
    .attr("font-weight", 700)
    .attr("fill", "#0f172a")
    .text("4. Sweet Spot Analysis");

  card4.append("text")
    .attr("x", CFG.CARD_PAD)
    .attr("y", CFG.CARD_PAD + 46)
    .attr("font-size", 11)
    .attr("fill", "#64748b")
    .text("Average subscribers by upload count buckets");

  const uploadBuckets = [
    { label: "0-100", min: 0, max: 100 },
    { label: "100-500", min: 100, max: 500 },
    { label: "500-1K", min: 500, max: 1000 },
    { label: "1K-5K", min: 1000, max: 5000 },
    { label: "5K-10K", min: 5000, max: 10000 },
    { label: "10K+", min: 10000, max: Infinity }
  ];

  const bucketStats = uploadBuckets.map(bucket => {
    const bucketData = processedData.filter(d => d.uploads >= bucket.min && d.uploads < bucket.max);
    return {
      label: bucket.label,
      count: bucketData.length,
      avgSubs: d3.mean(bucketData, d => d.subs) || 0,
      medianSubs: d3.median(bucketData, d => d.subs) || 0
    };
  }).filter(d => d.count >= 10);

  const sweetW = card4W - CFG.CARD_PAD * 2 - 80;
  const sweetH = card4H - CFG.CARD_PAD * 2 - 100;
  const sweetX = CFG.CARD_PAD + 70;
  const sweetY = CFG.CARD_PAD + 70;

  const scaleXSweet = d3.scaleBand()
    .domain(bucketStats.map(d => d.label))
    .range([0, sweetW])
    .padding(0.2);

  const scaleYSweet = d3.scaleLinear()
    .domain([0, d3.max(bucketStats, d => d.avgSubs) * 1.1])
    .range([sweetH, 0])
    .nice();

  const sweetLine = d3.line()
    .x(d => sweetX + scaleXSweet(d.label) + scaleXSweet.bandwidth() / 2)
    .y(d => sweetY + scaleYSweet(d.avgSubs))
    .curve(d3.curveMonotoneX);

  bucketStats.forEach((d, i) => {
    const x = sweetX + scaleXSweet(d.label);
    const barHeight = sweetH - scaleYSweet(d.avgSubs);

    const bar = card4.append("rect")
      .attr("x", x)
      .attr("y", sweetY + scaleYSweet(d.avgSubs))
      .attr("width", scaleXSweet.bandwidth())
      .attr("height", barHeight)
      .attr("fill", "#3b82f6")
      .attr("fill-opacity", 0.6)
      .attr("rx", 4)
      .style("cursor", "pointer")
      .on("pointerenter", function(event) {
        tooltip.show(event, [
          `Upload Range: ${d.label}`,
          `Channels: ${d3.format(",")(d.count)}`,
          `Avg Subscribers: ${d3.format(".2s")(d.avgSubs)}`,
          `Median Subscribers: ${d3.format(".2s")(d.medianSubs)}`
        ]);
        d3.select(this).attr("fill-opacity", 0.9).attr("filter", "url(#glow6)");
      })
      .on("pointerleave", function() {
        tooltip.hide();
        d3.select(this).attr("fill-opacity", 0.6).attr("filter", null);
      });
  });

  card4.append("path")
    .datum(bucketStats)
    .attr("d", sweetLine)
    .attr("fill", "none")
    .attr("stroke", "#ef4444")
    .attr("stroke-width", 3)
    .attr("stroke-linecap", "round");

  bucketStats.forEach(d => {
    card4.append("circle")
      .attr("cx", sweetX + scaleXSweet(d.label) + scaleXSweet.bandwidth() / 2)
      .attr("cy", sweetY + scaleYSweet(d.avgSubs))
      .attr("r", 6)
      .attr("fill", "#ef4444")
      .attr("stroke", "#ffffff")
      .attr("stroke-width", 2);
  });

  card4.append("g")
    .attr("transform", `translate(${sweetX}, ${sweetY + sweetH})`)
    .call(d3.axisBottom(scaleXSweet))
    .call(g => g.selectAll("text").attr("font-size", 10).attr("fill", AXIS_CONFIG.tickFill))
    .call(g => g.select(".domain").attr("stroke", AXIS_CONFIG.domainColor));

  card4.append("g")
    .attr("transform", `translate(${sweetX}, ${sweetY})`)
    .call(d3.axisLeft(scaleYSweet).ticks(5).tickFormat(d3.format(".2s")))
    .call(g => g.selectAll("text").attr("font-size", 10).attr("fill", AXIS_CONFIG.tickFill))
    .call(g => g.select(".domain").attr("stroke", AXIS_CONFIG.domainColor));

  card4.append("text")
    .attr("x", sweetX + sweetW / 2)
    .attr("y", sweetY + sweetH + 40)
    .attr("text-anchor", "middle")
    .attr("font-size", 11)
    .attr("font-weight", 600)
    .attr("fill", AXIS_CONFIG.labelFill)
    .text("Upload Count Range");

  card4.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -(sweetY + sweetH / 2))
    .attr("y", sweetX - 50)
    .attr("text-anchor", "middle")
    .attr("font-size", 11)
    .attr("font-weight", 600)
    .attr("fill", AXIS_CONFIG.labelFill)
    .text("Avg Subscribers");

  const card5X = card4W + CFG.GRID_GAP;
  const card5 = chartLayer.append("g").attr("transform", `translate(${card5X}, ${card4Y})`);

  card5.append("rect")
    .attr("width", card4W)
    .attr("height", card4H)
    .attr("fill", "#ffffff")
    .attr("stroke", "#e2e8f0")
    .attr("stroke-width", 2)
    .attr("rx", 16)
    .attr("filter", "url(#cardShadow6)");

  card5.append("text")
    .attr("x", CFG.CARD_PAD)
    .attr("y", CFG.CARD_PAD + 24)
    .attr("font-size", 20)
    .attr("font-weight", 700)
    .attr("fill", "#0f172a")
    .text("5. Quality Champions");

  card5.append("text")
    .attr("x", CFG.CARD_PAD)
    .attr("y", CFG.CARD_PAD + 46)
    .attr("font-size", 11)
    .attr("fill", "#64748b")
    .text("Top channels with highest subscribers-per-upload ratio");

  const qualityChampions = processedData
    .filter(d => d.uploads >= 50)
    .sort((a, b) => b.subsPerUpload - a.subsPerUpload)
    .slice(0, 12);

  const champW = card4W - CFG.CARD_PAD * 2 - 80;
  const champH = card4H - CFG.CARD_PAD * 2 - 100;
  const champX = CFG.CARD_PAD + 120;
  const champY = CFG.CARD_PAD + 70;

  const scaleXChamp = d3.scaleLinear()
    .domain([0, d3.max(qualityChampions, d => d.subsPerUpload)])
    .range([0, champW])
    .nice();

  const scaleYChamp = d3.scaleBand()
    .domain(qualityChampions.map(d => d.channel))
    .range([0, champH])
    .padding(0.25);

  qualityChampions.forEach(d => {
    const y = champY + scaleYChamp(d.channel);
    const barWidth = scaleXChamp(d.subsPerUpload);

    card5.append("text")
      .attr("x", champX - 8)
      .attr("y", y + scaleYChamp.bandwidth() / 2 + 4)
      .attr("text-anchor", "end")
      .attr("font-size", 10)
      .attr("font-weight", 500)
      .attr("fill", "#334155")
      .text(d.channel.length > 14 ? d.channel.substring(0, 12) + ".." : d.channel);

    const bar = card5.append("rect")
      .attr("x", champX)
      .attr("y", y)
      .attr("width", barWidth)
      .attr("height", scaleYChamp.bandwidth())
      .attr("fill", getCategoryColor(d.category))
      .attr("rx", 3)
      .attr("opacity", 0.8)
      .style("cursor", "pointer")
      .on("pointerenter", function(event) {
        setActive("channel", d.channel);
        setActive("category", d.category);
        tooltip.show(event, [
          d.channel,
          `Category: ${d.category}`,
          `Subs/Upload: ${d3.format(",")(Math.round(d.subsPerUpload))}`,
          `Total Subs: ${d3.format(".2s")(d.subs)}`,
          `Uploads: ${d3.format(",")(d.uploads)}`
        ]);
        d3.select(this).attr("opacity", 1).attr("filter", "url(#glow6)");
      })
      .on("pointerleave", function() {
        clearActive();
        tooltip.hide();
        d3.select(this).attr("opacity", 0.8).attr("filter", null);
      });

    card5.append("text")
      .attr("x", champX + barWidth + 5)
      .attr("y", y + scaleYChamp.bandwidth() / 2 + 4)
      .attr("font-size", 9)
      .attr("font-weight", 600)
      .attr("fill", "#64748b")
      .text(d3.format(".2s")(d.subsPerUpload));

    subscribe(state => {
      const match = (!state.activeCategory || state.activeCategory === d.category) &&
                    (!state.activeChannel || state.activeChannel === d.channel);
      bar.attr("opacity", match ? 0.8 : 0.2);
    });
  });

  card5.append("g")
    .attr("transform", `translate(${champX}, ${champY + champH})`)
    .call(d3.axisBottom(scaleXChamp).ticks(5).tickFormat(d3.format(".2s")))
    .call(g => g.selectAll("text").attr("font-size", 10).attr("fill", AXIS_CONFIG.tickFill))
    .call(g => g.select(".domain").attr("stroke", AXIS_CONFIG.domainColor));

  card5.append("text")
    .attr("x", champX + champW / 2)
    .attr("y", champY + champH + 40)
    .attr("text-anchor", "middle")
    .attr("font-size", 11)
    .attr("font-weight", 600)
    .attr("fill", AXIS_CONFIG.labelFill)
    .text("Subscribers per Upload");

  const card6Y = card4Y + card4H + CFG.GRID_GAP;
  const card6W = availableWidth;
  const card6H = 280;
  const card6 = chartLayer.append("g").attr("transform", `translate(0, ${card6Y})`);

  card6.append("rect")
    .attr("width", card6W)
    .attr("height", card6H)
    .attr("fill", "#ffffff")
    .attr("stroke", "#e2e8f0")
    .attr("stroke-width", 2)
    .attr("rx", 16)
    .attr("filter", "url(#cardShadow6)");

  card6.append("text")
    .attr("x", CFG.CARD_PAD)
    .attr("y", CFG.CARD_PAD + 24)
    .attr("font-size", 20)
    .attr("font-weight", 700)
    .attr("fill", "#0f172a")
    .text("6. Key Insights & Findings");

  const groupStats = uploadGroups.map(group => {
    const groupData = processedData.filter(d => d.uploadGroup === group);
    return {
      group,
      count: groupData.length,
      avgSubs: d3.mean(groupData, d => d.subs),
      medianSubs: d3.median(groupData, d => d.subs),
      avgUploads: d3.mean(groupData, d => d.uploads)
    };
  });

  const insights = [
    { 
      title: "Sweet Spot",
      value: `${bucketStats.sort((a, b) => b.avgSubs - a.avgSubs)[0]?.label || "N/A"}`,
      subtitle: "Best upload range",
      color: "#3b82f6"
    },
    { 
      title: "Median Low",
      value: d3.format(".2s")(groupStats.find(d => d.group === "Low")?.medianSubs || 0),
      subtitle: "Low uploader subs",
      color: "#3b82f6"
    },
    { 
      title: "Median High",
      value: d3.format(".2s")(groupStats.find(d => d.group === "High")?.medianSubs || 0),
      subtitle: "High uploader subs",
      color: "#10b981"
    },
    { 
      title: "Best Category",
      value: categoryBenefit[0]?.category?.substring(0, 12) || "N/A",
      subtitle: "Benefits most from uploads",
      color: "#10b981"
    },
    { 
      title: "Quality Wins",
      value: categoryBenefit.filter(d => d.benefit < 0).length.toString(),
      subtitle: "Categories favor quality",
      color: "#f59e0b"
    },
    { 
      title: "Top Efficiency",
      value: qualityChampions[0]?.channel?.substring(0, 12) || "N/A",
      subtitle: "Highest subs/upload",
      color: "#ef4444"
    }
  ];

  const insightCardW = (card6W - CFG.CARD_PAD * 2 - 50) / insights.length;
  const insightCardH = 140;
  const insightCardY = CFG.CARD_PAD + 55;

  insights.forEach((insight, i) => {
    const x = CFG.CARD_PAD + i * (insightCardW + 10);
    
    card6.append("rect")
      .attr("x", x)
      .attr("y", insightCardY)
      .attr("width", insightCardW)
      .attr("height", insightCardH)
      .attr("fill", insight.color)
      .attr("fill-opacity", 0.08)
      .attr("stroke", insight.color)
      .attr("stroke-width", 2)
      .attr("rx", 12);

    card6.append("text")
      .attr("x", x + insightCardW / 2)
      .attr("y", insightCardY + 30)
      .attr("text-anchor", "middle")
      .attr("font-size", 11)
      .attr("font-weight", 600)
      .attr("fill", insight.color)
      .text(insight.title);

    card6.append("text")
      .attr("x", x + insightCardW / 2)
      .attr("y", insightCardY + 70)
      .attr("text-anchor", "middle")
      .attr("font-size", 22)
      .attr("font-weight", 800)
      .attr("fill", "#0f172a")
      .text(insight.value);

    card6.append("text")
      .attr("x", x + insightCardW / 2)
      .attr("y", insightCardY + 100)
      .attr("text-anchor", "middle")
      .attr("font-size", 9)
      .attr("fill", "#64748b")
      .text(insight.subtitle);
  });

  const tooltipGroup = svg.select("g.tooltip-group");
  if (!tooltipGroup.empty()) {
    tooltipGroup.node().parentNode.appendChild(tooltipGroup.node());
  }

  svg.node().value = null;
  return svg.node();
}


function _29(md){return(
md`# Conclusion
## Main Insights
The interactive visualizations reveal that YouTube's creator economy operates as a complex, multidimensional system where success manifests differently across geographic, categorical, and temporal dimensions. The global map analysis demonstrates that while the United States, India, and Brazil dominate in absolute subscriber counts and total earnings, success metrics diverge significantly when normalized for population and audience efficiency: countries like South Korea and the United Kingdom achieve disproportionately high earnings-per-million-subscribers, indicating superior monetization strategies or more valuable audience demographics, while nations with massive subscriber bases do not always translate that scale into proportional revenue. Category-level analysis exposes fundamental disconnects between popularity and profitability—Entertainment leads in total subscribers but Music achieves higher view-to-subscriber ratios (2.5:1) indicating superior content replay value, Education channels (particularly Cocomelon at $50.4M) earn premium advertiser rates despite smaller audiences, and channels like Zee TV ($0.62/subscriber) dramatically outperform larger competitors like MrBeast ($0.21/subscriber) through content optimization rather than viral growth. The earnings correlation analysis confirms that while subscriber scale predicts baseline revenue, views-per-subscriber engagement and earnings-per-view (EPV) efficiency vary by 10-20× across categories, with Kids, Education, and Shows content commanding premium CPMs while Gaming faces engagement challenges and lower per-view monetization. Temporal evolution patterns show distinct growth eras: early YouTube (2005-2010) favored experimental content diversity, the growth era (2010-2015) saw Entertainment category consolidation, the modern era (2015-2020) experienced Music and Education expansion, and the post-2020 period demonstrates stabilization with established mega-creators maintaining dominance while upload frequency analysis reveals diminishing returns beyond optimal content cadences specific to each category. <br>
## Limitations and Extensions
Interactive exploration enables users to understand that YouTube success is not monolithic but rather exists across three independent axes: audience size (who subscribes), audience reach (what gets watched), and audience value (what earns money), with top-performing channels excelling in multiple dimensions simultaneously while many successful creators optimize for specific niches through monetization efficiency rather than scale. However, the analysis faces several limitations: the dataset represents only top-performing channels, creating survivorship bias and excluding insights about typical creator experiences; earnings estimates rely on publicly available ranges rather than verified platform data, introducing uncertainty in monetization comparisons; temporal analysis is constrained to channel creation dates without tracking career trajectories or content strategy evolution; and the absence of engagement metrics beyond view counts (such as likes, comments, watch time, or audience retention) limits understanding of content quality and community strength. Potential extensions that would significantly enhance this work include: incorporating time-series data to track how channel performance evolves across different growth phases and content pivots; integrating detailed metadata about video titles, descriptions, tags, and thumbnail strategies to identify content optimization patterns; analyzing audience demographics (age, gender, geography) and watch behavior (session duration, return rates) to understand who consumes different content types; developing predictive models that identify early indicators of long-term success to guide emerging creators; examining network effects through collaboration patterns, recommendation algorithm impacts, and cross-platform promotion strategies; and extending geographic analysis to regional and city-level granularity to capture localized creator ecosystems within large countries. Such extensions would transform this descriptive analysis of success patterns into prescriptive guidance for creators, advertisers, and platform designers seeking to understand and optimize performance in the increasingly complex creator economy.

## Finally
YouTube success has no universal formula

Scale ≠ value - Smaller markets can monetize better than larger ones. Audience value beats audience size.

Popularity ≠ profitability - Each category has distinct economics. Music leads in engagement; Education commands premium rates.

Efficiency beats scale - Earnings-per-view varies 10–20×. A smaller, efficient channel can outearn a larger one.

Timing is critical - Each category has a golden age. Early adopters in growing categories gain lasting advantages.

Strategy depends on category - More uploads help Music (+6.1M) but hurt Education (-5.1M). Opposite strategies on the same platform.

Success requires aligning strategy with category, geography, timing, and quality. Top creators optimize across multiple dimensions, not just one metric. strategy with category, geography, timing, and quality. Top creators optimize across multiple dimensions, not just one metric.`
)}

function _correlation_data(cleanedData){return(
cleanedData
  .filter(d =>
    d.avg_yearly_earnings > 0 &&
    d.subscribers > 100000 &&
    d.video_views > 1000000 &&
    d.category !== "TED" &&
    d.earnings_per_view > 0
  )
  .map(d => ({
    Youtuber: d.youtuber,
    Category: d.category,
    Subscribers: d.subscribers,
    Views: d.video_views,
    Earnings: d.avg_yearly_earnings,
    EPV: d.earnings_per_view,
    Engagement: d.video_views / d.subscribers * 100
  }))
)}

function _cat_summary(d3,cleanedData){return(
d3.rollups(
  cleanedData.filter(d =>
    d.avg_yearly_earnings > 0 &&
    d.subscribers > 0 &&
    d.video_views > 0 &&
    d.category !== "TED"
  ),

  v => ({
    avg_subs: d3.mean(v, d => d.subscribers),
    avg_earnings: d3.mean(v, d => d.avg_yearly_earnings),
    avg_views: d3.mean(v, d => d.video_views),
    avg_epv: d3.mean(v, d => d.earnings_per_view),
    avg_eng: d3.mean(v, d => (d.video_views / d.subscribers) * 100),
    count: v.length
  }),

  d => d.category
)
.map(([category, x]) => ({
  Category: category,
  Subscribers: x.avg_subs,
  Earnings: x.avg_earnings,
  Views: x.avg_views,
  EPV: x.avg_epv,
  Engagement: x.avg_eng,
  Count: x.count
}))
.sort((a, b) => d3.descending(a.Subscribers, b.Subscribers))
)}

function _top_epv(cleanedData,d3){return(
cleanedData
  .filter(d =>
    +d.earnings_per_view > 0 &&
    +d.video_views > 1_000_000 &&
    +d.avg_yearly_earnings > 0
  )
  .sort((a, b) => d3.descending(+a.earnings_per_view, +b.earnings_per_view))
  .slice(0, 25)
  .map(d => ({
    youtuber: d.youtuber,
    category: d.category,
    earnings_per_view: Number(d.earnings_per_view) || 0,
    avg_yearly_earnings: Number(d.avg_yearly_earnings) || 0,
    subscribers: Number(d.subscribers) || 0,
    views: Number(d.video_views) || 0
  }))
)}

function _q4_prepared_data(cleanedData)
{
  const cleanNumber = v =>
    v == null
      ? 0
      : typeof v === "number"
      ? v
      : +String(v).replace(/,/g, "");

  // Base channel-level data
  const base = cleanedData
    .map(d => {
      const subscribers = cleanNumber(d.subscribers);
      const views = cleanNumber(d.video_views);

      // Use existing views_per_subscriber if present; otherwise compute
      let engagement =
        d.views_per_subscriber != null
          ? +d.views_per_subscriber
          : subscribers > 0
          ? views / subscribers
          : 0;

      // Guard against NaN / Infinity
      if (!Number.isFinite(engagement)) engagement = 0;

      return {
        youtuber: d.youtuber,
        category: d.category,
        country: d.country,
        subscribers,
        views,
        engagement // views per subscriber
      };
    })
    .filter(d => d.subscribers > 0 && d.views > 0);

  // 1) Scatter data: we use all valid channels
  const scatterData = base.slice(); // shallow copy

  // 2) Engagement leaders: sort by engagement (views per subscriber)
  //    Filter to avoid tiny channels with weird ratios
  const engagementLeaders = base
    .filter(
      d =>
        d.subscribers >= 1_000_000 && // at least 1M subs
        d.views >= 10_000_000 && // at least 10M views
        d.engagement > 0
    )
    .sort((a, b) => b.engagement - a.engagement)
    .slice(0, 25);

  const categories = Array.from(
    new Set(base.map(d => d.category))
  ).sort();

  // Simple Pearson correlation helper
  function pearson(xArr, yArr) {
    const n = xArr.length;
    if (n === 0 || yArr.length !== n) return NaN;
    let sumX = 0,
      sumY = 0,
      sumXY = 0,
      sumX2 = 0,
      sumY2 = 0;
    for (let i = 0; i < n; i++) {
      const x = xArr[i];
      const y = yArr[i];
      sumX += x;
      sumY += y;
      sumXY += x * y;
      sumX2 += x * x;
      sumY2 += y * y;
    }
    const num = n * sumXY - sumX * sumY;
    const den = Math.sqrt(
      (n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY)
    );
    if (den === 0) return NaN;
    return num / den;
  }

  // Correlation in log space (more meaningful given huge ranges)
  const logSubs = scatterData.map(d => Math.log10(d.subscribers));
  const logViews = scatterData.map(d => Math.log10(d.views));
  const corrLog = pearson(logSubs, logViews);

  return {
    scatterData,
    engagementLeaders,
    categories,
    corrLog
  };
}


function _world(){return(
fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
  .then(response => response.json())
)}

function _processYouTubeCountryData(d3){return(
function processYouTubeCountryData(cleanedData) {
  const validData = cleanedData.filter(d => 
    d.country && 
    d.country.trim() !== '' &&
    d.subscribers > 0 &&
    d.avg_yearly_earnings !== null
  );
  
  console.log(`Processing ${validData.length} valid channels from ${cleanedData.length} total`);
  
  const countryGroups = d3.group(validData, d => d.country);
  
  const countryStats = Array.from(countryGroups, ([country, channels]) => {
    const totalChannels = channels.length;
    const totalSubscribers = d3.sum(channels, d => d.subscribers);
    const totalViews = d3.sum(channels, d => d.video_views);
    const totalEarnings = d3.sum(channels, d => d.avg_yearly_earnings);
    
    const topChannel = channels.reduce((max, channel) => 
      (channel.subscribers > max.subscribers) ? channel : max
    );
    
    const countryData = channels[0];
    const population = countryData.population || 0;
    
    const earningsPerMillion = totalSubscribers > 0 ? (totalEarnings / totalSubscribers) * 1000000 : 0;
    const viewsPerSubscriber = totalSubscribers > 0 ? totalViews / totalSubscribers : 0;
    const subscribersPerCapita = population > 0 ? (totalSubscribers / population) * 100 : 0;
    const topChannelDominance = totalSubscribers > 0 ? (topChannel.subscribers / totalSubscribers) * 100 : 0;
    
    return {
      country: country,
      abbreviation: countryData.abbreviation,
      latitude: countryData.latitude,
      longitude: countryData.longitude,
      population: population,
      totalChannels: totalChannels,
      totalSubscribers: totalSubscribers,
      totalViews: totalViews,
      totalEarnings: Math.round(totalEarnings),
      avgEarnings: Math.round(totalEarnings / totalChannels),
      avgSubscribers: Math.round(totalSubscribers / totalChannels),
      topChannel: topChannel.youtuber,
      topChannelSubscribers: topChannel.subscribers,
      topChannelDominance: Math.round(topChannelDominance * 100) / 100,
      earningsPerMillion: Math.round(earningsPerMillion * 100) / 100,
      viewsPerSubscriber: Math.round(viewsPerSubscriber * 100) / 100,
      subscribersPerCapita: Math.round(subscribersPerCapita * 10000) / 10000,
      grossTertiaryEnrollment: countryData.gross_tertiary_enrollment || 0,
      unemploymentRate: countryData.unemployment_rate || 0,
      urbanPopulation: countryData.urban_population || 0
    };
  });
  
  countryStats.sort((a, b) => b.totalSubscribers - a.totalSubscribers);
  
  countryStats.forEach((d, i) => {
    d.subscriberRank = i + 1;
  });
  
  const globalAvgEarningsPerMillion = d3.mean(countryStats, d => d.earningsPerMillion);
  
  countryStats.forEach(d => {
    d.earningsEfficiency = globalAvgEarningsPerMillion > 0 ? 
      Math.round((d.earningsPerMillion / globalAvgEarningsPerMillion) * 100) / 100 : 0;
    d.punchAboveWeight = d.earningsEfficiency > 1.2;
  });
  
  return countryStats;
}
)}

function _countryData(processYouTubeCountryData,cleanedData){return(
processYouTubeCountryData(cleanedData)
)}

function _topojson(require){return(
require("topojson-client@3")
)}

function _countryNameMap(){return(
new Map([
  ["United States", "United States of America"],
  ["India", "India"],
  ["Brazil", "Brazil"],
  ["United Kingdom", "United Kingdom"],
  ["South Korea", "South Korea"],
  ["Russia", "Russia"],
  ["Mexico", "Mexico"],
  ["Argentina", "Argentina"],
  ["Canada", "Canada"],
  ["Chile", "Chile"],
  ["Colombia", "Colombia"],
  ["Thailand", "Thailand"],
  ["Japan", "Japan"],
  ["Spain", "Spain"],
  ["Germany", "Germany"],
  ["Indonesia", "Indonesia"],
  ["Philippines", "Philippines"],
  ["Ukraine", "Ukraine"],
  ["Turkey", "Turkey"],
  ["El Salvador", "El Salvador"],
  ["Pakistan", "Pakistan"],
  ["Australia", "Australia"],
  ["France", "France"],
  ["Italy", "Italy"],
  ["Afghanistan", "Afghanistan"],
  ["Kuwait", "Kuwait"],
  ["United Arab Emirates", "United Arab Emirates"],
  ["Jordan", "Jordan"]
])
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  const fileAttachments = new Map([
    ["Global YouTube Statistics.csv", {url: new URL("./files/b191d7ef322f8c9c4c092aa89f14663322b42621b7f70c06826bc066591a3e262a522aa13a26fd2749da4a83e66902121d3cf1acb477f4ca90edf8e7c7e4e39a.csv", import.meta.url), mimeType: "text/csv", toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["md"], _2);
  main.variable(observer()).define(["md"], _3);
  main.variable(observer()).define(["md"], _4);
  main.variable(observer()).define(["md"], _5);
  main.variable(observer("data")).define("data", ["FileAttachment"], _data);
  main.variable(observer("cleanedData")).define("cleanedData", ["data"], _cleanedData);
  main.variable(observer()).define(["md"], _8);
  main.variable(observer()).define(["md"], _9);
  main.variable(observer("tableData")).define("tableData", ["countryData"], _tableData);
  main.variable(observer()).define(["Inputs","tableData","d3"], _11);
  main.variable(observer("viewof globalMap")).define("viewof globalMap", ["world","d3","topojson","countryData","countryNameMap"], _globalMap);
  main.variable(observer("globalMap")).define("globalMap", ["Generators", "viewof globalMap"], (G, _) => G.input(_));
  main.variable(observer()).define(["md"], _13);
  main.variable(observer()).define(["md"], _14);
  main.variable(observer("viewof categoryTable")).define("viewof categoryTable", ["d3","cleanedData","Inputs"], _categoryTable);
  main.variable(observer("categoryTable")).define("categoryTable", ["Generators", "viewof categoryTable"], (G, _) => G.input(_));
  main.variable(observer()).define(["d3","cleanedData"], _16);
  main.variable(observer()).define(["md"], _17);
  main.variable(observer()).define(["md"], _18);
  main.variable(observer("question_3_complete_dashboard")).define("question_3_complete_dashboard", ["d3","cleanedData"], _question_3_complete_dashboard);
  main.variable(observer()).define(["md"], _20);
  main.variable(observer()).define(["md"], _21);
  main.variable(observer("question_4_complete_dashboard")).define("question_4_complete_dashboard", ["q4_prepared_data","d3"], _question_4_complete_dashboard);
  main.variable(observer()).define(["md"], _23);
  main.variable(observer("viewof q5_categoryTable")).define("viewof q5_categoryTable", ["data","d3","Inputs"], _q5_categoryTable);
  main.variable(observer("q5_categoryTable")).define("q5_categoryTable", ["Generators", "viewof q5_categoryTable"], (G, _) => G.input(_));
  main.variable(observer("viewof q5_evolution")).define("viewof q5_evolution", ["data","d3"], _q5_evolution);
  main.variable(observer("q5_evolution")).define("q5_evolution", ["Generators", "viewof q5_evolution"], (G, _) => G.input(_));
  main.variable(observer("viewof q6_countryTable")).define("viewof q6_countryTable", ["data","d3","Inputs"], _q6_countryTable);
  main.variable(observer("q6_countryTable")).define("q6_countryTable", ["Generators", "viewof q6_countryTable"], (G, _) => G.input(_));
  main.variable(observer()).define(["md"], _27);
  main.variable(observer("viewof q6_uploadStrategy")).define("viewof q6_uploadStrategy", ["require","data","d3"], _q6_uploadStrategy);
  main.variable(observer("q6_uploadStrategy")).define("q6_uploadStrategy", ["Generators", "viewof q6_uploadStrategy"], (G, _) => G.input(_));
  main.variable(observer()).define(["md"], _29);
  main.variable(observer("correlation_data")).define("correlation_data", ["cleanedData"], _correlation_data);
  main.variable(observer("cat_summary")).define("cat_summary", ["d3","cleanedData"], _cat_summary);
  main.variable(observer("top_epv")).define("top_epv", ["cleanedData","d3"], _top_epv);
  main.variable(observer("q4_prepared_data")).define("q4_prepared_data", ["cleanedData"], _q4_prepared_data);
  main.variable(observer("world")).define("world", _world);
  main.variable(observer("processYouTubeCountryData")).define("processYouTubeCountryData", ["d3"], _processYouTubeCountryData);
  main.variable(observer("countryData")).define("countryData", ["processYouTubeCountryData","cleanedData"], _countryData);
  main.variable(observer("topojson")).define("topojson", ["require"], _topojson);
  main.variable(observer("countryNameMap")).define("countryNameMap", _countryNameMap);
  return main;
}
