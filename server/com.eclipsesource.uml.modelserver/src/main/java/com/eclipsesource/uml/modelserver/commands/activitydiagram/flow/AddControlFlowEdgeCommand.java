/********************************************************************************
 * Copyright (c) 2021 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.eclipsesource.uml.modelserver.commands.activitydiagram.flow;

import java.util.function.Supplier;

import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.ecore.util.EcoreUtil;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.uml2.uml.ActivityEdge;

import com.eclipsesource.uml.modelserver.commands.commons.notation.UmlNotationElementCommand;
import com.eclipsesource.uml.modelserver.unotation.Edge;
import com.eclipsesource.uml.modelserver.unotation.SemanticProxy;
import com.eclipsesource.uml.modelserver.unotation.UnotationFactory;

public class AddControlFlowEdgeCommand extends UmlNotationElementCommand {

   protected String semanticProxyUri;
   protected Supplier<ActivityEdge> controlflowSupplier;

   private AddControlFlowEdgeCommand(final EditingDomain domain, final URI modelUri) {
      super(domain, modelUri);
      this.semanticProxyUri = null;
      this.controlflowSupplier = null;
   }

   public AddControlFlowEdgeCommand(final EditingDomain domain, final URI modelUri, final String semanticProxyUri) {
      this(domain, modelUri);
      this.semanticProxyUri = semanticProxyUri;
   }

   public AddControlFlowEdgeCommand(final EditingDomain domain, final URI modelUri,
      final Supplier<ActivityEdge> controlflowSupplier) {
      this(domain, modelUri);
      this.controlflowSupplier = controlflowSupplier;
   }

   @Override
   protected void doExecute() {
      ActivityEdge semanticEdge = controlflowSupplier.get();
      if (semanticEdge == null) {
         return;
      }

      Edge newEdge = UnotationFactory.eINSTANCE.createEdge();

      SemanticProxy proxy = UnotationFactory.eINSTANCE.createSemanticProxy();
      if (this.semanticProxyUri != null) {
         proxy.setUri(this.semanticProxyUri);
      } else {
         String uri = EcoreUtil.getURI(semanticEdge).fragment();
         proxy.setUri(uri);
      }
      newEdge.setSemanticElement(proxy);

      umlDiagram.getElements().add(newEdge);
   }

}
