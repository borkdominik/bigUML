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
import com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.association.RemoveAssociationCompoundCommand;
import com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.data_type.RemoveDataTypeCompoundCommand;
import com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.enumeration.RemoveEnumerationCompoundCommand;
import com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.enumeration_literal.RemoveEnumerationLiteralSemanticCommand;
import com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.generalization.RemoveGeneralizationCompoundCommand;
import com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.operation.RemoveOperationSemanticCommand;
import com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.primitive_type.RemovePrimitiveTypeCompoundCommand;
import com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.property.RemovePropertySemanticCommand;
import com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.property.SetPropertyTypeSemanticCommand;
import com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.uclass.RemoveClassCompoundCommand;
import com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.uinterface.RemoveInterfaceCompoundCommand;
import com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.upackage.RemovePackageCompoundCommand;

public final class ClassDiagramCrossReferenceRemover {
   public static String MATCHER_CONTEXT_KEY = "matcher_context";

   protected final ModelContext context;
   protected final CrossReferenceMatcher<Command> matcher;

   public ClassDiagramCrossReferenceRemover(final ModelContext context) {
      super();

      this.context = context;
      this.matcher = new CrossReferenceMatcher.Builder<Command>()
         // Association
         .match((setting, interest) -> AssociationMatcher
            .ofUsage(setting, interest)
            .map(association -> new RemoveAssociationCompoundCommand(context, association.getPackage(), association)))
         // Class
         .match((setting, interest) -> ClassMatcher
            .ofChildUsage(setting, interest)
            .map(uclass -> new RemoveClassCompoundCommand(context, uclass.getPackage(), uclass)))
         // Data Type
         .match((setting, interest) -> DataTypeMatcher
            .ofChildUsage(setting, interest)
            .map(dataType -> new RemoveDataTypeCompoundCommand(context, dataType.getPackage(), dataType)))
         // Enumeration Literal
         .match((setting, interest) -> EnumerationLiteralMatcher
            .ofUsage(setting, interest)
            .map(literal -> new RemoveEnumerationLiteralSemanticCommand(context, literal.getEnumeration(), literal)))
         // Enumeration
         .match((setting, interest) -> EnumerationMatcher
            .ofChildUsage(setting, interest)
            .map(enumeration -> new RemoveEnumerationCompoundCommand(context, enumeration.getPackage(), enumeration)))
         // Generalization
         .match((setting, interest) -> GeneralizationMatcher
            .ofUsage(setting, interest)
            .map(generalization -> new RemoveGeneralizationCompoundCommand(context, generalization.getSpecific(),
               generalization)))
         // Interface
         .match((setting, interest) -> InterfaceMatcher
            .ofChildUsage(setting, interest)
            .map(uinterface -> new RemoveInterfaceCompoundCommand(context, uinterface.getPackage(), uinterface)))
         // Operation
         .match((setting, interest) -> OperationMatcher
            .ofUsage(setting, interest)
            .map(operation -> new RemoveOperationSemanticCommand(context, (OperationOwner) operation.eContainer(),
               operation)))
         // Package
         .match((setting, interest) -> PackageMatcher
            .ofChildUsage(setting, interest)
            .map(upackage -> new RemovePackageCompoundCommand(context, upackage.getNestingPackage(), upackage)))
         // Primitive Type
         .match((setting, interest) -> PrimitiveTypeMatcher
            .ofChildUsage(setting, interest)
            .map(primitiveType -> new RemovePrimitiveTypeCompoundCommand(context, primitiveType.getPackage(),
               primitiveType)))
         // Property
         .match((setting, interest) -> PropertyMatcher
            .ofOwnedAttributeTypeUsage(setting, interest)
            .map(property -> new SetPropertyTypeSemanticCommand(context, property, null)))
         .match((setting, interest) -> PropertyMatcher
            .ofOwnedAttributeAssociationUsage(setting, interest)
            .map(
               property -> new RemovePropertySemanticCommand(context, (AttributeOwner) property.getOwner(), property)))
         .build();

      context.data.putIfAbsent(MATCHER_CONTEXT_KEY, new MatcherContext());
   }

   public Set<Command> removeCommandsFor(final EObject elementToRemove) {
      var matcherContext = context.get(MATCHER_CONTEXT_KEY, MatcherContext.class).get();

      return matcher.find(matcherContext, elementToRemove, context.model.eResource());
   }
}
