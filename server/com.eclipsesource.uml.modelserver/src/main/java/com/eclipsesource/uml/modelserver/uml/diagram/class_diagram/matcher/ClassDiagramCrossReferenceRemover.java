/********************************************************************************
 * Copyright (c) 2022 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.matcher;

import java.util.Set;

import org.eclipse.emf.common.command.Command;
import org.eclipse.emf.ecore.EObject;
import org.eclipse.uml2.uml.AttributeOwner;
import org.eclipse.uml2.uml.OperationOwner;

import com.eclipsesource.uml.modelserver.shared.matcher.CrossReferenceMatcher;
import com.eclipsesource.uml.modelserver.shared.matcher.MatcherContext;
import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.association.DeleteAssociationCompoundCommand;
import com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.data_type.DeleteDataTypeCompoundCommand;
import com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.enumeration.DeleteEnumerationCompoundCommand;
import com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.enumeration_literal.DeleteEnumerationLiteralSemanticCommand;
import com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.generalization.DeleteGeneralizationCompoundCommand;
import com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.operation.DeleteOperationSemanticCommand;
import com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.primitive_type.DeletePrimitiveTypeCompoundCommand;
import com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.property.DeletePropertySemanticCommand;
import com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.property.UpdatePropertyTypeSemanticCommand;
import com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.uclass.DeleteClassCompoundCommand;
import com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.uinterface.DeleteInterfaceCompoundCommand;
import com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.upackage.DeletePackageCompoundCommand;

public final class ClassDiagramCrossReferenceRemover {
   public static String MATCHER_CONTEXT_KEY = "matcher_context";

   private final ModelContext context;
   private final CrossReferenceMatcher<Command> matcher;

   public ClassDiagramCrossReferenceRemover(final ModelContext context) {
      super();

      this.context = context;
      this.matcher = new CrossReferenceMatcher.Builder<Command>()
         // Association
         .match((setting, interest) -> AssociationMatcher
            .ofUsage(setting, interest)
            .map(association -> new DeleteAssociationCompoundCommand(context, association.getPackage(), association)))
         // Class
         .match((setting, interest) -> ClassMatcher
            .ofChildUsage(setting, interest)
            .map(uclass -> new DeleteClassCompoundCommand(context, uclass.getPackage(), uclass)))
         // Data Type
         .match((setting, interest) -> DataTypeMatcher
            .ofChildUsage(setting, interest)
            .map(dataType -> new DeleteDataTypeCompoundCommand(context, dataType.getPackage(), dataType)))
         // Enumeration Literal
         .match((setting, interest) -> EnumerationLiteralMatcher
            .ofUsage(setting, interest)
            .map(literal -> new DeleteEnumerationLiteralSemanticCommand(context, literal.getEnumeration(), literal)))
         // Enumeration
         .match((setting, interest) -> EnumerationMatcher
            .ofChildUsage(setting, interest)
            .map(enumeration -> new DeleteEnumerationCompoundCommand(context, enumeration.getPackage(), enumeration)))
         // Generalization
         .match((setting, interest) -> GeneralizationMatcher
            .ofUsage(setting, interest)
            .map(generalization -> new DeleteGeneralizationCompoundCommand(context, generalization.getSpecific(),
               generalization)))
         // Interface
         .match((setting, interest) -> InterfaceMatcher
            .ofChildUsage(setting, interest)
            .map(uinterface -> new DeleteInterfaceCompoundCommand(context, uinterface.getPackage(), uinterface)))
         // Operation
         .match((setting, interest) -> OperationMatcher
            .ofUsage(setting, interest)
            .map(operation -> new DeleteOperationSemanticCommand(context, (OperationOwner) operation.eContainer(),
               operation)))
         // Package
         .match((setting, interest) -> PackageMatcher
            .ofChildUsage(setting, interest)
            .map(upackage -> new DeletePackageCompoundCommand(context, upackage.getNestingPackage(), upackage)))
         // Primitive Type
         .match((setting, interest) -> PrimitiveTypeMatcher
            .ofChildUsage(setting, interest)
            .map(primitiveType -> new DeletePrimitiveTypeCompoundCommand(context, primitiveType.getPackage(),
               primitiveType)))
         // Property
         .match((setting, interest) -> PropertyMatcher
            .ofOwnedAttributeTypeUsage(setting, interest)
            .map(property -> new UpdatePropertyTypeSemanticCommand(context, property, null)))
         .match((setting, interest) -> PropertyMatcher
            .ofOwnedAttributeAssociationUsage(setting, interest)
            .map(
               property -> new DeletePropertySemanticCommand(context, (AttributeOwner) property.getOwner(), property)))
         .build();

      context.data.putIfAbsent(MATCHER_CONTEXT_KEY, new MatcherContext());
   }

   public Set<Command> deleteCommandsFor(final EObject interest) {
      var matcherContext = context.get(MATCHER_CONTEXT_KEY, MatcherContext.class).get();

      return matcher.find(matcherContext, interest, context.model.eResource());
   }
}
