using AddisMesobKMS.API.Data;
using AddisMesobKMS.API.Data;
using AddisMesobKMS.API.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add Database Context
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Add JWT Authentication
var jwtKey = builder.Configuration["Jwt:Key"] ?? throw new Exception("JWT Key not configured");
var key = Encoding.ASCII.GetBytes(jwtKey);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false;
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ValidateIssuer = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidateAudience = true,
        ValidAudience = builder.Configuration["Jwt:Audience"],
        ValidateLifetime = true,
        ClockSkew = TimeSpan.Zero
    };
});

// Add Authorization
builder.Services.AddAuthorization();

// Add Services
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IEmployeeService, EmployeeService>();
builder.Services.AddScoped<IKnowledgeService, KnowledgeService>();
builder.Services.AddScoped<IIssueService, IssueService>();
builder.Services.AddScoped<ICommunityService, CommunityService>();
builder.Services.AddScoped<IOffboardingService, OffboardingService>();
builder.Services.AddScoped<IQMSFeedbackService, QMSFeedbackService>();

// Add Controllers
builder.Services.AddControllers();

// Configure Swagger with JWT Support
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("Auth", new OpenApiInfo { Title = "Authentication APIs", Version = "v1" });
    c.SwaggerDoc("Admin", new OpenApiInfo { Title = "Admin APIs", Version = "v1" });
    c.SwaggerDoc("Employee", new OpenApiInfo { Title = "Employee APIs", Version = "v1" });
    c.SwaggerDoc("Knowledge", new OpenApiInfo { Title = "Knowledge Base APIs", Version = "v1" });
    c.SwaggerDoc("Issues", new OpenApiInfo { Title = "Issues APIs", Version = "v1" });
    c.SwaggerDoc("Community", new OpenApiInfo { Title = "Community APIs", Version = "v1" });

    // Add JWT Authentication to Swagger
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Enter 'Bearer' [space] and then your token",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/Auth/swagger.json", "Auth APIs");
        c.SwaggerEndpoint("/swagger/Admin/swagger.json", "Admin APIs");
        c.SwaggerEndpoint("/swagger/Employee/swagger.json", "Employee APIs");
        c.SwaggerEndpoint("/swagger/Knowledge/swagger.json", "Knowledge Base APIs");
        c.SwaggerEndpoint("/swagger/Issues/swagger.json", "Issues APIs");
        c.SwaggerEndpoint("/swagger/Community/swagger.json", "Community APIs");
    });
}

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

// Seed Database
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    await DbInitializer.InitializeAsync(dbContext);
}

app.Run();