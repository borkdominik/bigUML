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
package com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.reference;

import java.util.Set;

import org.eclipse.emf.common.command.Command;
import org.eclipse.emf.ecore.EObject;

import com.eclipsesource.uml.modelserver.shared.matcher.CrossReferenceFinder;
import com.eclipsesource.uml.modelserver.shared.matcher.MatcherContext;
import com.eclipsesource.uml.modelserver.shared.model.ModelContext;

public final class ClassDiagramCrossReferenceRemover {
   public static String MATCHER_CONTEXT_KEY = "matcher_context";

   private final ModelContext context;
   private final CrossReferenceFinder<Command> finder;

   public ClassDiagramCrossReferenceRemover(final ModelContext context) {
      super();

      this.context = context;
      this.finder = new CrossReferenceFinder<>(context, Set.of(
         new AbstractionReferenceRemover(),
         new AssociationReferenceRemover(),
         new ClassReferenceRemover(),
         new DataTypeReferenceRemover(),
         new DependencyReferenceRemover(),
         new EnumerationLiteralReferenceRemover(),
         new EnumerationReferenceRemover(),
         new GeneralizationReferenceRemover(),
         new InterfaceRealizationReferenceRemover(),
         new InterfaceReferenceRemover(),
         new OperationReferenceRemover(),
         new PackageImportReferenceRemover(),
         new PackageMergeReferenceRemover(),
         new PackageReferenceRemover(),
         new ParameterReferenceRemover(),
         new PrimitiveTypeReferenceRemover(),
         new PropertyReferenceRemover(),
         new RealizationReferenceRemover(),
         new SubstitutionReferenceRemover(),
         new UsageReferenceRemover()));

      context.data.putIfAbsent(MATCHER_CONTEXT_KEY, new MatcherContext());
   }

   public Set<Command> deleteCommandsFor(final EObject interest) {
      var matcherContext = context.get(MATCHER_CONTEXT_KEY, MatcherContext.class).get();

      return finder.find(matcherContext, interest, context.model.eResource());
   }
}
