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
package com.eclipsesource.uml.modelserver.commands.activitydiagram.partition;

import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;

import com.eclipsesource.uml.modelserver.commands.activitydiagram.general.RemoveActivityNodeCompoundCommand;
import com.eclipsesource.uml.modelserver.commands.commons.notation.RemoveNotationElementCommand;
import com.eclipsesource.uml.modelserver.commands.util.UmlSemanticCommandUtil;

public class RemovePartitionCompoundCommand extends CompoundCommand {

   public RemovePartitionCompoundCommand(final EditingDomain domain, final URI modelUri, final String parentUri,
      final String partitionUri) {
      RemovePartitionCommand semanticCmd = new RemovePartitionCommand(domain, modelUri, partitionUri);
      final String activityParentUri = UmlSemanticCommandUtil
         .getSemanticUriFragment(semanticCmd.getGroup().containingActivity());

      // recursive remove all sub partitions and their nodes
      semanticCmd.getGroup().getSubgroups().forEach(g -> {
         final String subUri = UmlSemanticCommandUtil.getSemanticUriFragment(g);
         this.append(new RemovePartitionCompoundCommand(domain, modelUri, partitionUri, subUri));
      });

      // remove all nodes of this partition
      semanticCmd.getGroupNodes().forEach(node -> {
         final String nodeUri = UmlSemanticCommandUtil.getSemanticUriFragment(node);
         this.append(new RemoveActivityNodeCompoundCommand(domain, modelUri, activityParentUri, nodeUri));
      });

      this.append(semanticCmd);
      this.append(new RemoveNotationElementCommand(domain, modelUri, partitionUri));

   }

}
