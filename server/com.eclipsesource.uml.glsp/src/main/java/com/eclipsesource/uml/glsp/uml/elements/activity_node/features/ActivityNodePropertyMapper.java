package com.eclipsesource.uml.glsp.uml.elements.activity_node.features;

import java.util.Optional;

import org.eclipse.uml2.uml.ActivityNode;
import org.eclipse.uml2.uml.VisibilityKind;

import com.eclipsesource.uml.glsp.core.handler.operation.update.UpdateOperation;
import com.eclipsesource.uml.glsp.features.property_palette.handler.action.UpdateElementPropertyAction;
import com.eclipsesource.uml.glsp.features.property_palette.model.PropertyPalette;
import com.eclipsesource.uml.glsp.uml.elements.activity_node.ActivityNodeConfiguration;
import com.eclipsesource.uml.glsp.uml.elements.activity_node.ActivityNodeOperationHandler;
import com.eclipsesource.uml.glsp.uml.features.property_palette.RepresentationElementPropertyMapper;
import com.eclipsesource.uml.glsp.uml.utils.element.VisibilityKindUtils;
import com.eclipsesource.uml.modelserver.uml.elements.activity_node.commands.UpdateActivityNodeArgument;
import com.eclipsesource.uml.modelserver.unotation.Representation;
import com.google.inject.Inject;
import com.google.inject.assistedinject.Assisted;

public class ActivityNodePropertyMapper extends RepresentationElementPropertyMapper<ActivityNode> {

   @Inject
   public ActivityNodePropertyMapper(@Assisted final Representation representation) {
      super(representation);
   }

   @Override
   public PropertyPalette map(final ActivityNode source) {
      var elementId = idGenerator.getOrCreateId(source);

      var items = this.propertyBuilder(ActivityNodeConfiguration.Property.class, elementId)
         .text(ActivityNodeConfiguration.Property.NAME, "Name", source.getName())
         .choice(
            ActivityNodeConfiguration.Property.VISIBILITY_KIND,
            "Visibility",
            VisibilityKindUtils.asChoices(),
            source.getVisibility().getLiteral())
         .items();

      return new PropertyPalette(elementId, source.getName(), items);
   }

   @Override
   public Optional<UpdateOperation> map(final UpdateElementPropertyAction action) {
      var property = getProperty(ActivityNodeConfiguration.Property.class, action);
      var handler = getHandler(ActivityNodeOperationHandler.class, action);

      UpdateOperation operation = null;
      switch (property) {
         case NAME:
            operation = handler.withArgument(
               UpdateActivityNodeArgument.by()
                  .name(action.getValue())
                  .build());
            break;
         case VISIBILITY_KIND:
            operation = handler.withArgument(
               UpdateActivityNodeArgument.by()
                  .visibilityKind(VisibilityKind.get(action.getValue()))
                  .build());
            break;
      }

      return withContext(operation);
   }
}
