package com.eclipsesource.uml.glsp.uml.elements.activity.features;

import java.util.Optional;

import org.eclipse.uml2.uml.Activity;
import org.eclipse.uml2.uml.VisibilityKind;

import com.eclipsesource.uml.glsp.core.handler.operation.update.UpdateOperation;
import com.eclipsesource.uml.glsp.features.property_palette.handler.action.UpdateElementPropertyAction;
import com.eclipsesource.uml.glsp.features.property_palette.model.PropertyPalette;
import com.eclipsesource.uml.glsp.uml.elements.activity.ActivityOperationHandler;
import com.eclipsesource.uml.glsp.uml.elements.activity.ActivityConfiguration;
import com.eclipsesource.uml.glsp.uml.features.property_palette.RepresentationElementPropertyMapper;
import com.eclipsesource.uml.glsp.uml.utils.element.VisibilityKindUtils;
import com.eclipsesource.uml.modelserver.uml.elements.activity.commands.UpdateActivityArgument;
import com.eclipsesource.uml.modelserver.unotation.Representation;
import com.google.inject.Inject;
import com.google.inject.assistedinject.Assisted;

public class ActivityPropertyMapper extends RepresentationElementPropertyMapper<Activity> {

   @Inject
   public ActivityPropertyMapper(@Assisted final Representation representation) {
      super(representation);
   }

   @Override
   public PropertyPalette map(final Activity source) {
      var elementId = idGenerator.getOrCreateId(source);

      var items = this.propertyBuilder(ActivityConfiguration.Property.class, elementId)
         .text(ActivityConfiguration.Property.NAME, "Name", source.getName())
         .bool(ActivityConfiguration.Property.IS_ABSTRACT, "Is abstract", source.isAbstract())
         .choice(
            ActivityConfiguration.Property.VISIBILITY_KIND,
            "Visibility",
            VisibilityKindUtils.asChoices(),
            source.getVisibility().getLiteral())
         .items();

      return new PropertyPalette(elementId, source.getName(), items);
   }

   @Override
   public Optional<UpdateOperation> map(final UpdateElementPropertyAction action) {
      var property = getProperty(ActivityConfiguration.Property.class, action);
      var handler = getHandler(ActivityOperationHandler.class, action);

      UpdateOperation operation = null;
      switch (property) {
         case NAME:
            operation = handler.withArgument(
               UpdateActivityArgument.by()
                  .name(action.getValue())
                  .build());
            break;
         case IS_ABSTRACT:
            operation = handler.withArgument(
               UpdateActivityArgument.by()
                  .isAbstract(Boolean.parseBoolean(action.getValue()))
                  .build());
            break;
         case VISIBILITY_KIND:
            operation = handler.withArgument(
               UpdateActivityArgument.by()
                  .visibilityKind(VisibilityKind.get(action.getValue()))
                  .build());
            break;
      }

      return withContext(operation);
   }
}
